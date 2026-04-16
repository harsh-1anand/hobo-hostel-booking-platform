const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);
router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.get('/owners', adminController.getAllOwners);
router.get('/hostels', adminController.getAllHostels);
router.get('/hostels/pending', adminController.getPendingHostels);
router.patch('/hostels/:id/approve', adminController.approveHostel);
router.patch('/hostels/:id/reject', adminController.rejectHostel);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;