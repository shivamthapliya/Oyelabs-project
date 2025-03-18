const User=require("../models/UserModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email} });
      if (!user) return res.status(401).json({ error: "Invalid email or password" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });
  
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token, {
        httpOnly: true
        // secure: true
      });
  
      res.json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.logout=(req, res) => {
    res.clearCookie('token', { httpOnly: true });
    return res.status(200).json({ message: 'Logged out successfully' });
  };
  