const router = require('express').Router();
const bookingController = require('../controllers/booking.controller');
const { protect, ownerOnly } = require('../middleware/auth.middleware');

router.post('/', protect, bookingController.createBooking);
router.get('/my', protect, bookingController.getMyBookings);
router.get('/owner/all', protect, ownerOnly, bookingController.getOwnerBookings);
router.put('/:id/cancel', protect, bookingController.cancelBooking);
router.get('/:id', protect, bookingController.getBookingById);
router.patch('/:id/payment', protect, bookingController.updatePaymentStatus);
router.patch('/:id/checkout', protect, ownerOnly, bookingController.markCheckout);
router.get('/hostel/:hostelId', protect, ownerOnly, bookingController.getHostelBookings);

module.exports = router;