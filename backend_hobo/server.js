const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { protect, adminOnly } = require('./middleware/auth.middleware');

const app = express();
app.use(cors());
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

app.post('/debug-register', (req, res) => {
  res.json({ ok: true, body: req.body });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/hostels', require('./routes/hostel.routes'));
app.use('/api/owner', require('./routes/owner.routes'));
app.use('/api/bookings', protect, require('./routes/booking.routes'));
app.use('/api/notifications', protect, require('./routes/notification.routes'));
app.use('/api/admin', protect, adminOnly, require('./routes/admin.routes'));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(process.env.PORT || 5000, () =>
    console.log("🚀 Server running on port 5000")
  );
})
.catch(err => console.log("❌ MongoDB Error:", err));