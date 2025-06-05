import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // 1. get user details from frontend
  // when data is coming through form submisttion or direct json, we get data from req.body

  const { fullName, email, username, password } = req.body;

  // check validation of fields
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check user if already exist
  const existedUser = await User.findOne({
    // This checks if username OR email exist
    $or: [{ username }, { email }],
  });

  // return with error if user already exist
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Now, firstly access images from fields
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // check if avatar is given or not (avatar is compulsory).
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  // upload them on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // check if avatar is uploaded on cloudinary or not by checking its above response
  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  // Create user object - create entry in database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // 1. check if user obj is created or not in database. Also select and remove password and refreshToken.

  // 2. we have to remove refreshToken and password because when entry in db, we sending response to frontend for succesfull entry. this response should not contain any sensitive information
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check if user created in database or not
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user.");
  }

  // Return response to frontend for succesfull entry in db
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

export { registerUser };
