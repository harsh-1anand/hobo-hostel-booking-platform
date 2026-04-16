const mongoose = require('mongoose');
require('dotenv').config();
const Hostel = require('./models/Hostel.model');
mongoose.connect(process.env.MONGO_URI).then(async () => {
    const data = await Hostel.find({ name: /hayat/i });
    console.log(JSON.stringify(data, null, 2));
    process.exit();
});
