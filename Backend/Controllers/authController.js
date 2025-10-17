import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import dotenv from "dotenv";
import { sendEmail } from "../Middleware/sendEmail.js";
import generateOTP  from "../utils/generateOtp.js";
dotenv.config();


// ============================
// ✅ REGISTER CONTROLLER
// ============================
export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, age, gender, height, weight, fitnessGoals, fitnessLevel } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      age,
      gender,
      height,
      weight,
      fitnessGoals: fitnessGoals || [],
      fitnessLevel: fitnessLevel || "Beginner", 
      otp,
      otpExpiresAt,
    });

    await user.save();

    await sendEmail(email, "Welcome to FitLife", "Thank you for registering!");

    res.status(201).json({
      success: true,
      message: "User registered successfully and OTP sent to email",
      data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        gender: user.gender,
        age: user.age,
        fitnessLevel: user.fitnessLevel,
        otp: user.otp,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors.map(e => e.message) });
    }
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ======================================
// ✅ 2️⃣ VERIFY OTP
// ======================================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.isVerified) return res.status(400).json({ success: false, message: 'User already verified' });

    if (user.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Account verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

//===========
// Resend Otp
//===========

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.isVerified) return res.status(400).json({ success: false, message: 'User already verified' });
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();
        await sendEmail(email, 'Resend OTP', `Your new OTP is: ${otp}`);

        res.status(200).json({ 
            success: true,
            message: 'OTP resent successfully',
            otp: user.otp
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ============================
// ✅ LOGIN CONTROLLER
// ============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Account not verified. Please verify OTP.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors.map(e => e.message) });
    }
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ============================
// ✅ LOGOUT CONTROLLER
// ============================
// For stateless JWT, logout is client-side (token removal). This route just responds success.
export const logoutUser = async (req, res) => {
  try {
    // If using cookies, you can clear cookie here
    // res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logout successful. Please remove token on client side.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ============================
// ✅ GET ALL USERS CONTROLLER
// ============================

  export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password -otp -otpExpiresAt');
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      console.error("Fetch users error:", error.message);
      res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
  };

