const router = require('express').Router();
const { getMyNotifications, markAsRead } = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getMyNotifications);
router.patch('/:id/read', protect, markAsRead);

module.exports = router;
