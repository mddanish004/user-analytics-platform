import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    session_id: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["page_view", "click"],
    },

    url: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      required: true,
    },

    x: {
      type: Number,
    },

    y: {
      type: Number,
    },

    viewport: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
