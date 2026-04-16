const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User.model');
require('dotenv').config();

async function testHTTP() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        
        // Find admin user
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log("No admin found in DB");
            process.exit(1);
        }

        // Generate token manually
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        const res = await fetch('http://localhost:5000/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.text();
        console.log("HTTP Stats Response HTTP Status:", res.status);
        console.log("HTTP Stats Response Data:", data);
        process.exit(0);
    } catch(err) {
        console.error("HTTP Fetch Failed:", err.message);
        process.exit(1);
    }
}
testHTTP();
