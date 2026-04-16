const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User.model');

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    const user = await User.findById('69d15b2e7abb8d22f9393cbf');
    if (user) {
        console.log("Found specific owner:", JSON.stringify({email: user.email, role: user.role}, null, 2));
    } else {
        console.log("Specific owner not found.");
        // let's grab the top 10 most recent users
        const recent = await User.find().sort({_id: -1}).limit(10).select('email role');
        console.log("Recent users:", JSON.stringify(recent, null, 2));
    }
    process.exit();
}).catch(console.error);
