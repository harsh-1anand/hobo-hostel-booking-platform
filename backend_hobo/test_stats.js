const mongoose = require('mongoose');
const User = require('./models/User.model');
const Hostel = require('./models/Hostel.model');
const Booking = require('./models/Booking.model');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {}).then(async () => {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalHostels = await Hostel.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingApprovals = await Hostel.countDocuments({ isApproved: false });

    console.log({
       totalUsers,
       totalOwners,
       totalHostels,
       totalBookings,
       pendingApprovals
    });

    const roles = await User.distinct('role');
    console.log("Distinct roles in DB:", roles);

    process.exit(0);
});
