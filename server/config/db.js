const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`MongoDB Connection Error: ${error.message}`);
        console.warn('Running in offline mode (some features may be unavailable)');
        // process.exit(1); // Keep server running
    }
};

module.exports = connectDB;
