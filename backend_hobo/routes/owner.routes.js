const router = require('express').Router();
const ownerController = require('../controllers/owner.controller');
const { protect, ownerOnly } = require('../middleware/auth.middleware');

router.get('/stats', protect, ownerOnly, ownerController.getOwnerStats);
router.get('/hostels', protect, ownerOnly, ownerController.getOwnerHostels);

module.exports = router;
