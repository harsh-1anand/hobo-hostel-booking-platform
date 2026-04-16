const Booking = require('../models/Booking.model');

exports.createBooking = async (req, res) => {
  try {
    const Hostel = require('../models/Hostel.model');
    const { hostel: hostelId, checkIn, checkOut, ...restBody } = req.body;

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    if (!hostel.isApproved) return res.status(400).json({ message: 'Hostel not approved' });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Overlap validation
    const overlappingBookings = await Booking.find({
      hostel: hostelId,
      status: { $in: ['confirmed', 'pending', 'completed'] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate }
    });

    const bookedBeds = overlappingBookings.length;
    if (bookedBeds >= hostel.availableBeds) {
      return res.status(400).json({ message: 'Not enough beds available for these dates' });
    }

    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = days * hostel.price;

    const booking = await Booking.create({ hostel: hostelId, checkIn, checkOut, ...restBody, user: req.user.id, totalPrice });

    // Note: Intentionally omitting hostel.availableBeds -= 1; to support dynamic capacity checking instead of permanent decrement.

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('hostel');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (booking.user.toString() !== req.user.id.toString())
      return res.status(403).json({ message: 'Not your booking' });

    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHostelBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ hostel: req.params.hostelId }).populate('user', 'name email');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hostel', 'name location price checkIn checkOut contact')
      .populate('user', 'name email');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentMethod, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (paymentMethod) booking.paymentMethod = paymentMethod;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markCheckout = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('hostel');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized: You do not own this hostel' });
    }
    booking.status = 'completed';
    await booking.save();

    const Notification = require('../models/Notification.model');
    await Notification.create({
      user: booking.user,
      message: 'Your stay is complete. Rate and review your experience.',
      link: `/user/hostel/${booking.hostel._id}`
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOwnerBookings = async (req, res) => {
  try {
    const Hostel = require('../models/Hostel.model');
    const ownerHostels = await Hostel.find({ owner: req.user.id }).select('_id name');
    const hostelIds = ownerHostels.map(h => h._id);

    const bookings = await Booking.find({ hostel: { $in: hostelIds } })
      .populate('user', 'name')
      .populate('hostel', 'name');

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};