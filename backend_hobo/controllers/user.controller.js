const User = require('../models/User.model');
const Booking = require('../models/Booking.model');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('firstName lastName email mobile dob role phone bio');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { phone, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { phone, bio }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const hostelId = req.params.hostelId;
    
    const index = user.wishlist.indexOf(hostelId);
    if (index === -1) {
      user.wishlist.push(hostelId);
    } else {
      user.wishlist.splice(index, 1);
    }
    await user.save();
    
    // Only return the updated wishlist object array for simplicity
    const updatedUser = await User.findById(req.user.id).populate('wishlist');
    res.json(updatedUser.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyBookingsCategorized = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('hostel');
    const now = new Date();
    
    const categorized = {
      upcoming: [],
      past: []
    };
    
    bookings.forEach(booking => {
      // If checkOut is in the past, or status is completed/cancelled, it's past
      if (new Date(booking.checkOut) < now || booking.status === 'completed' || booking.status === 'cancelled') {
        categorized.past.push(booking);
      } else {
        categorized.upcoming.push(booking);
      }
    });
    
    res.json(categorized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
