const Booking = require('../models/Booking.model');
const Hostel = require('../models/Hostel.model');

exports.getOwnerStats = async (req, res) => {
  try {
    // 1. Get all hostels owned by this user
    const hostels = await Hostel.find({ owner: req.user.id });
    const hostelIds = hostels.map(h => h._id);
    
    // 2. Get all bookings for these hostels
    const bookings = await Booking.find({ hostel: { $in: hostelIds } });

    // 3. Compute stats
    const totalBookings = bookings.length;
    
    // Sum earnings for confirmed/completed bookings
    const totalEarnings = bookings.reduce((sum, booking) => {
      if (booking.status === 'confirmed' || booking.status === 'completed') {
        return sum + (booking.totalPrice || 0);
      }
      return sum;
    }, 0);

    const hostelCount = hostels.length;

    res.json({
      totalBookings,
      totalEarnings,
      hostelCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOwnerHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
