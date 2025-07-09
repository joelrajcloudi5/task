"use server";
import UserModel from "@/app/models/UserModel";
import connectDB from "@/app/utils/db";

export const POST = async (req) => {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.json({ message: "Invalid email" }, { status: 401 });
    }

    user.isLoggedIn = false;
    await user.save();

    return Response.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
};
