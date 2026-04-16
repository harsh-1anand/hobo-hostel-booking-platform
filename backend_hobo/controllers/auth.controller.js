const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, firstName, lastName, email, mobile, dob, password, role } = req.body;

    // Strict Validations
    if (mobile && !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
    }
    
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (dob && new Date(dob) >= new Date()) {
      return res.status(400).json({ message: "Date of Birth must be in the past" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name || `${firstName} ${lastName}`, // Legacy fallback
      firstName,
      lastName,
      email,
      mobile,
      dob,
      password: hashed,
      role
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ message: "Registered", token, user });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
  exports.login = async (req, res) => {
    try {
  
      const { email, password, role } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // New Strict Role Validation
      if (role && user.role !== role) {
        return res.status(401).json({ message: "Unauthorized: Invalid role for this login" });
      }
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          role: user.role
        }
      });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };