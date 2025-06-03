import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const registerUser = asyncHandler(async (req, res) => {
  // 1. get user details from frontend
  // when data is coming through form submisttion or direct json, we get data from req.body

  const { fullName, email, username, password } = req.body;
  console.log("email:", email);

  if (fullName === "") {
    throw new ApiError(400, "full name is required here...");
  }
});

export { registerUser };
