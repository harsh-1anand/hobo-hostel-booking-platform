const router = require('express').Router();
const { getHostels, getHostel, addHostel, updateHostel, deleteHostel, getAvailability } = require('../controllers/hostel.controller');
const { protect, ownerOnly } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', getHostels);
router.get('/:id/availability', getAvailability);
router.get('/:id', getHostel);
router.post('/', protect, ownerOnly, upload.array('images', 5), addHostel);
router.put('/:id', protect, ownerOnly, updateHostel);
router.delete('/:id', protect, ownerOnly, deleteHostel);

module.exports = router;