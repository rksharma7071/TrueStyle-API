const { User } = require("../models/user");

// Get all users
async function handleGetAllUsers(req, res) {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

// Create new user
async function handleCreateNewUser(req, res) {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, email, and password are required." });
    }

    const result = await User.create({
      name,
      email,
      password,
      phone,
      role: role || "user",
    });

    console.log("Result: ", result);
    return res.status(201).json({
      msg: "User created successfully",
      user: result,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

// Get user by ID
async function handleGetUserUsingId(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

// Update user by ID
async function handleUpdateUserUsingId(req, res) {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    const updatedUser = await user.save();

    return res.json({
      status: "success",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

// Delete user by ID
async function handleDeleteUserUsingId(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "success", message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

module.exports = {
  handleGetAllUsers,
  handleCreateNewUser,
  handleGetUserUsingId,
  handleUpdateUserUsingId,
  handleDeleteUserUsingId,
};
