import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(400, "video ID not found");
  }

  // validate videoID
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  // Convert to numbers (query params come as strings)
  // const pageNumber = parseInt(page);
  // const limitNumber = parseInt(limit);

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
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

  if (!comments) {
    throw new ApiError(401, "No comments found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "All comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  // check if content is empty or not
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content is required");
  }

  // create new comment
  const newComment = await Comment.create({
    content: content,
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "comment added successfully"));
});

// TODO: update a comment
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  // check if commentId is in url
  if (!commentId) {
    throw new ApiError(400, "comment Id not found in URL");
  }

  // check if content and commentID is correct
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content is required");
  }

  // check if comment Id is correct
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid commentId - Not match as ObjectId");
  }

  const comment = await Comment.findById(commentId);

  // check if comment is there or not
  if (!comment) {
    throw new ApiError(404, "comment not found");
  }

  // Check ownership
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own comment");
  }

  // update and save
  comment.content = content;
  await comment.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment updated successfully"));
});

// TODO: delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // check comment Id in url
  if (!commentId) {
    throw new ApiError(400, "comment Id not found in url");
  }

  // comment ID as mongoDB object
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "comment ID is not matched as mongoDB Object");
  }

  // find the commenyt document
  const comment = await Comment.findById(commentId);

  // if comment is there or not
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // 4. Ownership check
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this comment");
  }

  // delete the comment
  await comment.deleteOne();

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
