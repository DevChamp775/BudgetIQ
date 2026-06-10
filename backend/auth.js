// ===============================
// AUTH.JS
// ===============================

import express  from "express";
import bcrypt   from "bcryptjs";
import jwt      from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

// ===============================
// CONSTANTS
// ===============================

const JWT_SECRET = "expense_secret_key";

// ===============================
// USER MODEL
// ===============================

const UserSchema = new mongoose.Schema({
  name:     { type: String },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// ===============================
// SIGNUP
// ===============================

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: "Signup Successful" });

  } catch (error) {
    console.log("Auth signup error:", error);
    res.json({ success: false, message: "Server Error" });
  }
});

// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token, message: "Login Successful" });

  } catch (error) {
    console.log("Auth login error:", error);
    res.json({ success: false, message: "Server Error" });
  }
});

export default router;