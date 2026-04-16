const Review = require('../models/Review.model');
const Booking = require('../models/Booking.model');
const Hostel = require('../models/Hostel.model');

exports.createReview = async (req, res) => {
  try {
    const { hostelId, rating, comment } = req.body;
    
    // 1. Verify user has a completed booking for this hostel
    const completedBooking = await Booking.findOne({
      user: req.user.id,
      hostel: hostelId,
      status: 'completed'
    });
    
    if (!completedBooking) {
      return res.status(400).json({ message: 'You can only review a hostel after completing your stay.' });
    }
    
    // 2. Check if user already reviewed
    const existingReview = await Review.findOne({ userId: req.user.id, hostelId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this hostel.' });
    }

    // 3. Create Review
    const review = await Review.create({
      userId: req.user.id,
      hostelId,
      rating,
      comment
    });

    // 4. Update Hostel rating math
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ message: 'Hostel not found.' });

    const newReviewCount = hostel.reviewCount + 1;
    const newAverageRating = ((hostel.averageRating * hostel.reviewCount) + rating) / newReviewCount;

    hostel.reviewCount = newReviewCount;
    hostel.averageRating = newAverageRating;
    await hostel.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHostelReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hostelId: req.params.hostelId }).populate('userId', 'name avatar');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
