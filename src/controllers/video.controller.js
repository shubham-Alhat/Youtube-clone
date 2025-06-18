import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// get all videos for feed
const getAllVideos = asyncHandler(async (req, res) => {
  // GET /videos?page=2&limit=10&sortBy=views
  // req.query.page === "2";
  // req.query.limit === "10";
  // req.query.sortBy === "views";

  const { page = 1, limit = 10 } = req.query;
});

// TODO: get video, upload to cloudinary, create video
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // check if title is not empty.
  if (!title) {
    throw new ApiError(400, "video title is required");
  }
  // check if description is not empty.
  if (!description) {
    throw new ApiError(400, "video description is required");
  }

  // get local path of video file
  const videoLocalPath = req.files?.videoFile[0]?.path;

  // check if video file is given or not
  if (!videoLocalPath) {
    throw new ApiError(400, "video file is required to upload a video");
  }

  // get local path of video file
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  // check if video file is given or not
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required to upload a video");
  }

  // upload them on cloudinary
  const video = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  // check if video and thumbnail upload on cloudinary
  if (!video) {
    throw new ApiError(500, "video is not uploaded..");
  }

  if (!thumbnail) {
    throw new ApiError(500, "thumbnail is not uploaded..");
  }

  // after uploading on cloudinary, create a entry in db
  const videoInfo = await Video.create({
    videoFile: video.secure_url,
    thumbnail: thumbnail.secure_url,
    title,
    description,
    duration: video.duration,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, videoInfo, "video document is created successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
