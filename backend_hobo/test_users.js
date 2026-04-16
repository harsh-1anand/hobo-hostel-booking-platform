const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User.model');

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    const users = await User.find({}).select('email role');
    console.log(JSON.stringify(users, null, 2));
    process.exit();
}).catch(console.error);
