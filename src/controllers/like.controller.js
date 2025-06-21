import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

//TODO: toggle like on video
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video Id not found in url");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video Id in url");
  }

  // check if video exist
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found in database");
  }

  const existedLike = await Like.findOne({
    likedBy: new mongoose.Types.ObjectId(req.user._id),
    likeable: new mongoose.Types.ObjectId(videoId),
    likeableType: "Video",
  });

  if (existedLike) {
    // dislike
    const dislikedVideo = await Like.findByIdAndDelete(existedLike._id);

    // likes count of video

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          dislikedVideo,
          "The video is disliked successfully"
        )
      );
  } else {
    const likedVideo = await Like.create({
      likedBy: new mongoose.Types.ObjectId(req.user._id),
      likeable: new mongoose.Types.ObjectId(videoId),
      likeableType: "Video",
    });

    if (!likedVideo) {
      throw new ApiError(500, "Error while like video in database");
    }

    // Get updated like count
    const likesCount = await Like.countDocuments({
      likeable: videoId,
      likeableType: "Video",
      likeType: "like", // Only count likes, not dislikes
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { likedVideo, likesCount },
          "Video liked successfully"
        )
      );
  }
});

//TODO: toggle like on comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "comment Id not found in url");
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment Id in url");
  }

  // check if comment exist
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found in database");
  }

  const existedLike = await Like.findOne({
    likedBy: new mongoose.Types.ObjectId(req.user._id),
    likeable: new mongoose.Types.ObjectId(commentId),
    likeableType: "Comment",
  });

  if (existedLike) {
    // dislike
    const dislikedComment = await Like.findByIdAndDelete(existedLike._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          dislikedComment,
          "The comment is disliked successfully"
        )
      );
  } else {
    const likedComment = await Like.create({
      likedBy: new mongoose.Types.ObjectId(req.user._id),
      likeable: new mongoose.Types.ObjectId(commentId),
      likeableType: "Comment",
    });

    if (!likedComment) {
      throw new ApiError(500, "Error while like comment in database");
    }

    // Get updated like count
    const likesCount = await Like.countDocuments({
      likeable: commentId,
      likeableType: "Comment",
      likeType: "like", // Only count likes, not dislikes
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { likedComment, likesCount },
          "Comment liked successfully"
        )
      );
  }
});

//TODO: toggle like on tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
});

//TODO: get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
        likeableType: "Video",
        likeType: "like",
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "likeable",
        foreignField: "_id",
        as: "likedVideo",
        pipeline: [
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
        ],
      },
    },
    {
      $addFields: {
        likedVideo: {
          $first: "$likedVideo",
        },
      },
    },
  ]);

  if (!likedVideos || likedVideos.length == 0) {
    throw new ApiError(404, "No liked videos are found in database");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
