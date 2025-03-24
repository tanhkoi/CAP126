const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

// Get all users with filters
router.get("/", async (req, res) => {
  try {
    const { username, fullName, minLogin, maxLogin } = req.query;

    let filter = { status: true }; // Chỉ lấy user có status = true

    if (username) filter.username = { $regex: username, $options: "i" };
    if (fullName) filter.fullName = { $regex: fullName, $options: "i" };
    if (minLogin || maxLogin) {
      filter.loginCount = {};
      if (minLogin) filter.loginCount.$gte = parseInt(minLogin);
      if (maxLogin) filter.loginCount.$lte = parseInt(maxLogin);
    }

    const users = await User.find(filter).populate("role");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role");
    if (!user || !user.status) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const newUser = new User({
      username,
      email,
      password, // Cần hash password trước khi lưu
      role: role || "user",
    });

    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  try {
    const { username, email, password, fullName, avatarUrl, role } = req.body;
    let user = await User.findById(req.params.id);

    if (!user || !user.status) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password; // Cần hash trước khi lưu
    if (fullName) user.fullName = fullName;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (role) user.role = role;

    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Soft delete user
router.delete("/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user || !user.status) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.status = false;
    await user.save();

    res.status(200).json({ success: true, message: "User soft deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Activate user
router.post("/activate", async (req, res) => {
  try {
    const { email, username } = req.body;

    // Kiểm tra input
    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: "Email and username are required",
      });
    }

    // Tìm user theo email và username
    const user = await User.findOne({ email, username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Cập nhật status = true
    user.status = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User activated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
