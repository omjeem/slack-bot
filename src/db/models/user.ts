import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const UserModal = mongoose.model("User", UserSchema);

export default UserModal;
