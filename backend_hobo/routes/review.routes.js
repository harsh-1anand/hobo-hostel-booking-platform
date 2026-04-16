const router = require('express').Router();
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, reviewController.createReview);
router.get('/hostel/:hostelId', reviewController.getHostelReviews);

module.exports = router;
