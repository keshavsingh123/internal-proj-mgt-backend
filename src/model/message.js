import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    isDelete: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
