import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    rsvp: { type: String, default: "Attending" },
    dietary: { type: String, default: "" },
    tableNumber: { type: String, default: "" },
    subEventId: { type: mongoose.Schema.Types.ObjectId, ref: "SubEvent" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

guestSchema.index({ userId: 1 });
guestSchema.index({ subEventId: 1 });

export default mongoose.model("Guest", guestSchema);