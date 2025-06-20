import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // if name is not given
  if (!name || name.trim() == "") {
    throw new ApiError(400, "Playlist name is required");
  }

  // if description is not given
  if (!description || description.trim() == "") {
    throw new ApiError(400, "Playlist description is required");
  }

  const newPlaylist = await Playlist.create({
    name: name.trim(),
    description: description.trim(),
    videos: [],
    owner: req.user._id,
  });

  if (!newPlaylist) {
    throw new ApiError(500, "Error while creating new Playlist");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, newPlaylist, "New playlist created successfully")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "userId not found in url");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid userId in url");
  }

  const userPlaylist = await Playlist.find({
    owner: new mongoose.Types.ObjectId(userId),
  })
    .populate("videos", "title thumbnail duration views createdAt")
    .populate("owner", "fullName username avatar")
    .sort({ createdAt: -1 }); // Latest playlists first

  if (userPlaylist.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No playlists found for user"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist, "User playlist fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "playlist Id not found in url");
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist Id in url");
  }

  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
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
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "playlist Id not found in url");
  }

  if (!videoId) {
    throw new ApiError(400, "Video Id not found in url");
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist Id in url");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video Id in url");
  }

  // Check if playlist exists and user owns it
  const playlist = await Playlist.findOne({
    _id: playlistId,
    owner: req.user._id, //  Only playlist owner can add videos
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or you don't have permission");
  }

  // Check if video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $addToSet: { videos: videoId } },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(500, "Failed to add video to playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "video added in playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "playlist Id not found in url");
  }

  if (!videoId) {
    throw new ApiError(400, "Video Id not found in url");
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist Id in url");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video Id in url");
  }

  // Check if playlist exists and user owns it
  const playlist = await Playlist.findOne({
    _id: playlistId,
    owner: req.user._id, //  Only playlist owner can add videos
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or you don't have permission");
  }

  // Check if video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(500, "Failed to remove video from playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video remove from playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "playlist Id not found in url");
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist Id in url");
  }

  // Check if playlist exists and user owns it
  const playlist = await Playlist.findOne({
    _id: playlistId,
    owner: req.user._id, //  Only playlist owner can add videos
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or you don't have permission");
  }

  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
