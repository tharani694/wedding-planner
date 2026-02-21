import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    type: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    date: { type: String },
    location: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);