const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const owner = await User.findOne({ role: 'owner' });
  console.log("OWNER ID:", owner ? owner._id : 'No owner found');
  process.exit(0);
}
run();
