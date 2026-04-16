const User = require('../models/User.model');
const Hostel = require('../models/Hostel.model');
const Booking = require('../models/Booking.model');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalHostels = await Hostel.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingApprovals = await Hostel.countDocuments({ isApproved: false });

    res.json({
       totalUsers,
       totalOwners,
       totalHostels,
       totalBookings,
       pendingApprovals
    });
  } catch (err) {
     res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || '';

    const query = {};
    if (search) {
       query.$or = [
         { name: { $regex: search, $options: 'i' } },
         { email: { $regex: search, $options: 'i' } },
         { firstName: { $regex: search, $options: 'i' } }
       ];
    }
    if (role) query.role = role;

    const users = await User.find(query)
                            .select('-password')
                            .sort({ createdAt: -1 })
                            .skip((page - 1) * limit)
                            .limit(limit);
    
    const total = await User.countDocuments(query);
    res.json({ data: users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOwners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const matchQuery = { role: 'owner' };
    if (search) {
      matchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } }
      ];
    }

    const owners = await User.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'hostels',
          localField: '_id',
          foreignField: 'owner',
          as: 'hostelsOwned'
        }
      },
      {
         $addFields: { hostelCount: { $size: "$hostelsOwned" } }
      },
      { $project: { password: 0, hostelsOwned: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);
    
    const total = await User.countDocuments(matchQuery);
    
    res.json({ data: owners, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.getAllHostels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status; // 'approved' or 'pending'

    const query = {};
    if (search) {
       query.$or = [
         { name: { $regex: search, $options: 'i' } },
         { location: { $regex: search, $options: 'i' } }
       ];
    }
    if (status === 'approved') query.isApproved = true;
    if (status === 'pending') query.isApproved = false;

    const hostels = await Hostel.find(query)
                                .populate('owner', 'name email')
                                .sort({ createdAt: -1 })
                                .skip((page - 1) * limit)
                                .limit(limit);
                                
    const total = await Hostel.countDocuments(query);
    res.json({ data: hostels, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(hostel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectHostel = async (req, res) => {
  try {
    await Hostel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hostel rejected and deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ isApproved: false }).populate('owner', 'name email');
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Hostel.deleteMany({ owner: req.params.id }); 
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};