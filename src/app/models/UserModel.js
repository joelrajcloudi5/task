import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
    username: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
  
    otp: { type: String },
    otpExpires: { type: Date },
  },


  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
