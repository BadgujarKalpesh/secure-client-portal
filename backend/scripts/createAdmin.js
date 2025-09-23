const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/AdminSchema'); // Adjust path
require('dotenv').config();

const createAdminUser = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const username = 'admin';
    const password = '12345'; // Use a strong, temporary password

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
        console.log('Admin user already exists.');
        mongoose.disconnect();
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Admin.create({ username, password: hashedPassword });
    console.log('✅ Admin user created successfully!');
    mongoose.disconnect();
};

createAdminUser();