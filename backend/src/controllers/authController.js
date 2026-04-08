const User = require("../models/User");

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // --- Validate required fields ---
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are all required.",
      });
    }

    // --- Check for existing user ---
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return res.status(409).json({
        success: false,
        message: `${field} is already taken.`,
      });
    }

    // --- Create new user (password hashed by pre-save hook) ---
    const user = await User.create({ username, email, password });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

module.exports = { signup };
