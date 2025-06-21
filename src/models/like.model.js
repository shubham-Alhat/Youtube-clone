import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    // The user who liked
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The thing being liked (polymorphic reference)
    likeable: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    // What type of content is being liked
    likeableType: {
      type: String,
      required: true,
      enum: ["Video", "Comment", "Post", "Tweet"], // Add more as needed
    },
    // Optional: Support like/dislike
    likeType: {
      type: String,
      enum: ["like", "dislike"],
      default: "like",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
