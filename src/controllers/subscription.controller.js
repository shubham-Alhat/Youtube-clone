import mongoose, { isValidObjectId, mongo } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// TODO: toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // check channel Id in url
  if (!channelId) {
    throw new ApiError(400, "channel Id not found in url");
  }

  // check channel Id as Object ID
  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel Id in url");
  }

  // User cannot subscribe to itself..
  if (req.user._id.toString() === channelId.toString()) {
    throw new ApiError(400, "You can't subscribe to yourself");
  }

  // check if user alraedy subscribed to channel.
  // 1. if not, subscribed it to channel
  // 2. if subscribed, unsubscribed it to channel

  // check if user already subscribed to channel
  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: new mongoose.Types.ObjectId(channelId),
  });

  if (existingSubscription) {
    // already subscribed --> delete document
    const deleteSubscription = await Subscription.findByIdAndDelete(
      existingSubscription._id
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, deleteSubscription, "Unsubscribed to channel")
      );
  } else {
    // not subscribed ---> create document
    const newSubscription = await Subscription.create({
      subscriber: req.user._id,
      channel: new mongoose.Types.ObjectId(channelId),
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newSubscription, "Subscribed to channel"));
  }
});

// controller to return list of subscribers of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // check channel Id in url
  if (!channelId) {
    throw new ApiError(400, "channel Id not found in url");
  }

  // check channel Id as Object ID
  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel Id in url");
  }

  const channelSubscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
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
        subscriber: {
          $first: "$subscriber",
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelSubscribers,
        "All subscribers are fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
