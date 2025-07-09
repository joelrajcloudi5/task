import UserModel from "@/app/models/UserModel.js";
import connectDB from "@/app/utils/db";
import bcrypt from "bcryptjs";
import sendEmail from "@/app/utils/sendemail";

export const POST = async (req) => {
  try {
    await connectDB();

    const { username, email, password } = await req.json();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    const user = new UserModel({ username, email, password: hashedPassword });
    await user.save();

    // Send OTP email
    const htmlContent = `
      <h3>Hello ${username},</h3>
      <p>Thank you for registering! Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 10 minutes.</p>
    `;

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      html: htmlContent,
    });

    return Response.json({ message: "User created and OTP sent to email" }, { status: 201 });
  } catch (err) {
    const errors = err.errors
      ? Object.values(err.errors).map((e) => e.message)
      : [err.message];
    return Response.json({ message: errors }, { status: 400 });
  }
};
