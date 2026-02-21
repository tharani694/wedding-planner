import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    side: String,
    rsvp: {
      type: String,
      enum: ["Attending", "Not Attending", "Maybe"],
      default: "Attending"
    },
    subEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubEvent",
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

export default mongoose.model("Guest", guestSchema);