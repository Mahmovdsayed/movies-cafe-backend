import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    imageUrl: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["movie", "tv","actor"],
    },
    addedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default model("Posts", postSchema);
