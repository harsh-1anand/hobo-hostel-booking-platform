const Hostel = require('../models/Hostel.model');

exports.getHostels = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, minRating, amenities, sort } = req.query;
    let query = { isApproved: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
       query.price = {};
       if (minPrice !== undefined) query.price.$gte = Number(minPrice);
       if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }
    
    if (minRating !== undefined) {
      query.averageRating = { $gte: Number(minRating) };
    }
    
    if (amenities) {
      // Expecting array passed via query like ?amenities=Wi-Fi&amenities=AC or a comma separated string
      let amenitiesArray = [];
      if (Array.isArray(amenities)) {
        amenitiesArray = amenities;
      } else if (typeof amenities === 'string') {
        amenitiesArray = amenities.split(',').map(a => a.trim());
      }
      if (amenitiesArray.length > 0) {
        query.amenities = { $all: amenitiesArray };
      }
    }

    let sortOption = {};
    if (sort === 'price_asc') {
      sortOption.price = 1;
    } else if (sort === 'rating_desc') {
      sortOption.averageRating = -1;
    } else if (sort === 'newest') {
      sortOption.createdAt = -1;
    } else {
      sortOption.createdAt = -1;
    }

    const hostels = await Hostel.find(query).sort(sortOption).populate('owner', 'name email');
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate('owner', 'name email');
    if (!hostel) return res.status(404).json({ message: 'Not found' });
    res.json(hostel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addHostel = async (req, res) => {
  try {
    console.log("BODY RECV:", req.body);
    console.log("FILES RECV:", req.files);

    const { name, location, price, availableBeds } = req.body;
    if (!name || !location || !price || !availableBeds) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.images && Array.isArray(req.body.images)) {
      imagePaths = req.body.images;
    } else if (req.body.images && typeof req.body.images === 'string') {
      imagePaths = req.body.images.split(',').map(s => s.trim()).filter(Boolean);
    }

    const hostel = await Hostel.create({ 
      ...req.body,
      images: imagePaths,
      owner: req.user.id,
      isApproved: false // Explicitly unapproved on launch
    });
    res.status(201).json({ success: true, hostel });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: err.message, 
      debugBody: req.body, 
      debugHeaders: req.headers['content-type'],
      debugFiles: req.files
    });
  }
};

exports.updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: 'Not found' });

    // Check ownership
    if (hostel.owner.toString() !== req.user.id.toString())
      return res.status(403).json({ message: 'Not your hostel' });

    const updated = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: 'Not found' });

    // Check ownership
    if (hostel.owner.toString() !== req.user.id.toString())
      return res.status(403).json({ message: 'Not your hostel' });

    await Hostel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) return res.status(400).json({ message: 'Provide checkIn and checkOut dates' });

    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: 'Not found' });

    const Booking = require('../models/Booking.model');
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const overlappingBookings = await Booking.find({
      hostel: req.params.id,
      status: { $in: ['confirmed', 'pending', 'completed'] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate }
    });

    const bookedBeds = overlappingBookings.length;
    const availableBeds = Math.max(0, hostel.availableBeds - bookedBeds);

    res.json({ availableBeds, totalCapacity: hostel.availableBeds, overlappingBookingsCount: bookedBeds });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
