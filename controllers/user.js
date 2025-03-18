const User = require("../models/UserModel");
const bcrypt=require("bcryptjs")
// GET /users - Retrieve all users
exports.getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const results={};

    if (endIndex < await User.count()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
        results.users = await User.findAll({
        limit: limit,
        offset: startIndex
      });
      return res.status(200).json(results);
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
};

// GET /users/:id - Retrieve a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /users - Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user=await User.findOne({email});
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password:hashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /users/:id - Update a user’s details by ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email } = req.body;
    if(!name && !email) return res.json("nothing to update")
    await user.update({ name, email });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /users/:id - Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
