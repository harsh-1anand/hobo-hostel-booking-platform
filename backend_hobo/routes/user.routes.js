const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/me', protect, userController.getUserProfile);
router.put('/me', protect, userController.updateProfile);
router.get('/me/bookings', protect, userController.getMyBookingsCategorized);
router.get('/wishlist', protect, userController.getWishlist);
router.post('/wishlist/:hostelId', protect, userController.toggleWishlist);

module.exports = router;
