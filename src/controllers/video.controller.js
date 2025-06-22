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

  const { page = 1, limit = 10 } = req.query;

  // build aggregation pipeline to fetch videos
  // IMP NOTE = here, dont use "await" as in aggregatePaginate we have to pass pipeline array, not the result.
  const aggregatePipeline = Video.aggregate([
    {
      $match: {
        isPublished: true,
      },
    },
    {
      $sort: {
        createdAt: -1, // latest videos first
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  // define the options
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  // run aggregation with pagination
  const videos = await Video.aggregatePaginate(aggregatePipeline, options);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "All videos fetched successfully"));
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

  // check if videoId is passed or not
  if (!videoId) {
    throw new ApiError(400, "video Id not found in url");
  }

  // check if video Id is matched as MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video Id in url");
  }

  // aggregation pipeline
  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  // check if video is there or not
  if (!video || video.length === 0) {
    throw new ApiError(404, "video not found in database");
  }

  await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "video is fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // check if videoId is passed or not
  if (!videoId) {
    throw new ApiError(400, "video Id not found in url");
  }

  // check if video Id is matched as MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video Id in url");
  }

  // check if only video uploader can update the video
  const video = await Video.findById(videoId);

  // check if video is there or not
  if (!video) {
    throw new ApiError(404, "video not found in database");
  }

  // Check ownership
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own video details");
  }

  // 1. update the thumbnail
  let newThumbnailUrl = video.thumbnail;

  if (req.file?.path) {
    const thumbnail = await uploadOnCloudinary(req.file.path);
    if (!thumbnail?.secure_url) {
      throw new ApiError(500, "Error uploading thumbnail on cloudinary");
    }
    newThumbnailUrl = thumbnail.secure_url;
  }

  // access the updated fields
  const { title, description, isPublished } = req.body;

  const newVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
        isPublished: isPublished,
        thumbnail: newThumbnailUrl,
      },
    },
    { new: true }
  );

  if (!newVideo) {
    throw new ApiError(
      500,
      "Error while saving updated video details in database"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newVideo, "video details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // check if videoId is passed or not
  if (!videoId) {
    throw new ApiError(400, "video Id not found in url");
  }

  // check if video Id is matched as MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video Id in url");
  }

  // get video from db
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "video not found in database");
  }

  // check ownership
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own video");
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // check video Id in url
  if (!videoId) {
    throw new ApiError(400, "video Id not found in url");
  }

  // check video Id matched as mongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video Id in url");
  }

  // Step 2: Get the video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video.isPublished,
      },
    },
    { new: true }
  );

  if (!updatedVideo) {
    throw new ApiError(501, "video not found while toggling isPublished field");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedVideo,
        `Video isPublished set to ${updatedVideo.isPublished}`
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
