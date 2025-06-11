import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

// generate access and refresh token method
const generateAccessAndRefreshToken = async (userId) => {
  try {
    // find user by id
    const user = await User.findById(userId);

    // generate tokens here
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // store refresh token in database
    user.refreshToken = refreshToken;
    // This is an option "validateBeforeSave:false" passed to save() to tell Mongoose NOT to run schema validations before saving.
    // “Save this user without checking all validation rules. Just save what I changed.”
    await user.save({ validateBeforeSave: false });

    // return access and refresh token
    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access and refresh token"
    );
  }
};

// -----  steps for registering user  ------
// Get user details from frontend - Here we will use Postman to get user data.
// Validation - Whether user send empty string and details.
// Check if user already exist - we will check by username and email.
// Check for images - check for avatar because it is must.
// If avatar and coverimage is available, Store it in cloudinary.
// Create user object - create entry in db.
// Remove password and refresh token field from response.
// Check for user creation.
// return response.

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

  // if user not upload coverImage
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

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

// Login the user
// 1. Get data from req.body - email/username and password
// 2. username and email
// 3. find the user
// 4. if found, check password
// 5. Generate access and refresh token
// 6. Send them in cookies

const loginUser = asyncHandler(async (req, res) => {
  // Get data from req.body
  const { email, username, password } = req.body;

  // user should give us either username or email and we need compulsory password.
  // here, email and username will act as identifier.
  // here password is compulsory
  // check if user give email and password both
  if (!(email || username)) {
    throw new ApiError(400, "username or email is required");
  }

  // find the user
  const user = await User.findOne({
    // This checks if username OR email exist
    $or: [{ username }, { email }],
  });

  // if not found, throw error that user was never registered
  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  // check if password is right
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user credentials");
  }

  // Generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // What data want to send to user (OPTIONAL STEPS) -------
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Send them in cookies

  // our cookies can modify by frontend as well. so this options ensure that cookie only modified by backend
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  // here req.user come from authmiddleware because in it, we inject user object
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  // Set cookie options
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Clear cookies and send response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

// here, login user via refresh token.
// this refresh token, we will get these from cookies when user hit any api endpoint.
// when we get refresh token from cookies, we will check it in database.(i think so)

const refreshAccessToken = asyncHandler(async (req, res) => {
  // here, if user on mobile phone, req.body.refreshToken otherwise we use req.cookies.refreshToken
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // if refresh token not found or not correct, user is unauthorized.
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  // verify the refresh token
});

export { registerUser, loginUser, logoutUser };
