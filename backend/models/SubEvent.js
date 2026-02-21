import mongoose from "mongoose";

const subEventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: String },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("SubEvent", subEventSchema, "subEvents");