const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const products = require('./data/products');
const connectDB = require('./config/db');
const User = require('./models/User');
const Order = require('./models/Order');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/auth');
const { validate, schemas } = require('./middleware/validate');

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Vercel)
const PORT = 5000;

// Connect to Database
// connectDB(); // Moved to middleware/startup logic


// Security Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS Configuration
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://shinebro.com',
        'https://www.shinebro.com',
        /\.vercel\.app$/ // Allow all Vercel deployments
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Database Connection Middleware
app.use(async (req, res, next) => {
    // Skip for static files or if already connected
    if (mongoose.connection.readyState === 1) {
        return next();
    }
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failed in middleware:", error);
        res.status(503).json({ message: 'Service Unavailable: Database connection failed' });
    }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Get all products
app.get('/api/products', (req, res) => {
    const visibleProducts = products.filter(p => !p.isRemoved);
    res.json(visibleProducts);
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

const nodemailer = require('nodemailer');

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Create new order
app.post('/api/orders', validate(schemas.order), async (req, res) => {
    const orderData = req.body;
    console.log("Received order:", orderData);

    if (orderData.customer.phone && orderData.customer.phone.length !== 10) {
        return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits' });
    }

    try {
        // Generate unique order ID using timestamp + random string to avoid race conditions
        const date = new Date();
        const dateStr = date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0');

        // Use a random string instead of countDocuments to prevent duplicate IDs in concurrent requests
        const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const orderId = `ORD-${dateStr}-${randomSuffix}`;

        const newOrder = new Order({
            orderId,
            customer: orderData.customer,
            items: orderData.items,
            total: orderData.total,
            paymentMethod: orderData.paymentMethod,
            status: 'Processing'
        });

        await newOrder.save();

        // Send response immediately
        res.json({
            success: true,
            orderId: orderId,
            message: 'Order placed successfully'
        });

        // Send email notification asynchronously (don't block response)
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: `New Order Received: ${orderId}`,
            text: `You have received a new order!

Order ID: ${orderId}
Total Amount: ₹${orderData.total}
Payment Method: ${orderData.paymentMethod.toUpperCase()}

Customer Details:
Name: ${orderData.customer.firstName} ${orderData.customer.lastName}
Email: ${orderData.customer.email}
Phone: ${orderData.customer.phone}
Address: ${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.pincode}

Items:
${orderData.items.map(item => `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`).join('\n')}

Order Date: ${new Date().toLocaleString()}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    } catch (error) {
        console.error('Order creation error details:', error); // Enhanced logging
        if (error.code === 11000) {
            // Handle duplicate key error specifically if it still happens (unlikely with random suffix)
            return res.status(500).json({ success: false, message: 'Order ID collision, please try again.' });
        }
        res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
    }
});

// Get all orders (Admin)
app.get('/api/orders', async (req, res) => {
    try {
        const { email } = req.query;
        let query = {};
        if (email) {
            query = { 'customer.email': email };
        }
        const orders = await Order.find(query).sort({ createdAt: -1 });

        // Transform data to match frontend expectations if necessary
        // The frontend expects: id, customer (name), date, itemsSummary, total, status
        const formattedOrders = orders.map(order => ({
            id: order.orderId,
            customer: `${order.customer.firstName} ${order.customer.lastName}`,
            date: new Date(order.createdAt).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }),
            itemsSummary: order.items.map(i => `${i.name} (${i.quantity})`).join(', '),
            total: order.total,
            status: order.status,
            // Keep original object for details if needed
            original: order
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// Get single order
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Format order for frontend
        const formattedOrder = {
            id: order.orderId,
            customer: `${order.customer.firstName} ${order.customer.lastName}`,
            email: order.customer.email,
            date: new Date(order.createdAt).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }),
            items: order.items,
            total: order.total,
            status: order.status,
            address: order.customer, // Map customer details to address for frontend compatibility
            tracking: [
                { status: 'Order Placed', date: new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }), completed: true },
                { status: 'Packed', date: '', completed: ['Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) },
                { status: 'Shipped', date: '', completed: ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) },
                { status: 'Out for Delivery', date: '', completed: ['Out for Delivery', 'Delivered'].includes(order.status) },
                { status: 'Delivered', date: '', completed: order.status === 'Delivered' }
            ]
        };

        res.json(formattedOrder);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status (Admin)
app.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findOneAndUpdate(
            { orderId: id },
            { status: status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ success: true, message: 'Order status updated', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Failed to update order' });
    }
});

// Delete order (Admin)
app.delete('/api/orders/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findOneAndDelete({ orderId: id });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Failed to delete order' });
    }
});

// Contact Form Endpoint
app.post('/api/contact', validate(schemas.contact), (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send email' });
        } else {
            console.log('Email sent: ' + info.response);
            res.json({ success: true, message: 'Message sent successfully' });
        }
    });
});

// Admin Access Notification Endpoint
app.post('/api/notify-admin-access', (req, res) => {
    console.log("Admin access notification request received");
    console.log("Attempting to send email from:", process.env.GMAIL_USER);
    const { timestamp, userAgent } = req.body;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: 'shinebrofficial2@gmail.com', // Updated to correct email
        subject: '⚠️ Security Alert: Admin Login Page Accessed',
        text: `Security Alert!

Someone has accessed the Admin Login page of ShineBro.

Time: ${timestamp}
User Agent: ${userAgent}

If this was you, you can ignore this message.
If this was not you, please investigate immediately.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('CRITICAL ERROR sending alert email:', error);
            res.status(500).json({ success: false, message: 'Failed to send alert', error: error.message });
        } else {
            console.log('Alert email sent successfully!');
            console.log('Response:', info.response);
            res.json({ success: true, message: 'Alert sent successfully' });
        }
    });
});

// OTP Store (In-memory for demo purposes)
const otpStore = new Map();

// Generate and Send Verification Code
app.post('/api/send-verification-code', async (req, res) => {
    const { email } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code with expiration (10 minutes)
    otpStore.set(email, {
        code,
        expires: Date.now() + 10 * 60 * 1000
    });
    console.log(`🔐 GENERATED OTP for ${email}: ${code}`);

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Your ShineBro Verification Code',
        text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({ success: false, message: 'Failed to send verification code. Please check email configuration.' });
        } else {
            console.log('OTP sent to:', email);
            res.json({ success: true, message: 'Verification code sent' });
        }
    });
});

// Forgot Password - Request OTP
app.post('/api/forgot-password', validate(schemas.forgotPassword), async (req, res) => {
    console.log("DEBUG: Forgot Password endpoint hit for:", req.body.email);
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store code with expiration (10 minutes)
        otpStore.set(email, {
            code,
            expires: Date.now() + 10 * 60 * 1000
        });
        console.log(`🔐 RESET OTP for ${email}: ${code}`);

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'ShineBro Password Reset Code',
            text: `Your password reset code is: ${code}\n\nThis code will expire in 10 minutes.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP:', error);
                // In development/debugging, allow proceeding even if email fails
                // The OTP is logged to the console
                res.json({ success: true, message: 'Reset code generated (check server logs if email failed)' });
            } else {
                console.log('Reset OTP sent to:', email);
                res.json({ success: true, message: 'Reset code sent' });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password
app.post('/api/reset-password', validate(schemas.resetPassword), async (req, res) => {
    const { email, code, newPassword } = req.body;

    // Verify OTP
    const storedOtp = otpStore.get(email);
    if (!storedOtp) {
        return res.status(400).json({ message: 'Reset code expired or not found. Please request a new one.' });
    }

    if (storedOtp.code !== code) {
        return res.status(400).json({ message: 'Invalid reset code' });
    }

    if (Date.now() > storedOtp.expires) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'Reset code expired' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        // Clear OTP
        otpStore.delete(email);

        res.json({ success: true, message: 'Password reset successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Authentication Endpoints

// Signup
app.post('/api/signup', validate(schemas.signup), async (req, res) => {
    const { name, email, password, code } = req.body;

    // Check Database Connection
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database not connected. Please try again later.' });
    }

    // Verify OTP
    const storedOtp = otpStore.get(email);
    if (!storedOtp) {
        return res.status(400).json({ message: 'Verification code expired or not found. Please try again.' });
    }

    if (storedOtp.code !== code) {
        return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (Date.now() > storedOtp.expires) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'Verification code expired' });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            shippingInfo: {}
        });

        // Generate Token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Clear OTP after successful signup
        otpStore.delete(email);

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, shippingInfo: user.shippingInfo }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/api/login', validate(schemas.login), async (req, res) => {
    const { email, password } = req.body;

    // Check Database Connection
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database not connected. Please try again later.' });
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            // Check if password matches (hashed)
            let isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                // Generate Token
                const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

                res.json({
                    success: true,
                    token,
                    user: { id: user._id, name: user.name, email: user.email, shippingInfo: user.shippingInfo }
                });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('LOGIN ERROR DETAILS:', error);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

// Update Profile (Shipping Info) - Protected Route
app.post('/api/update-profile', authenticateToken, async (req, res) => {
    const { shippingInfo } = req.body;
    const email = req.user.email; // Get email from token

    try {
        const user = await User.findOne({ email });

        if (user) {
            user.shippingInfo = shippingInfo;

            // Also update the main name field if provided in shipping info
            if (shippingInfo.firstName || shippingInfo.lastName) {
                const newName = `${shippingInfo.firstName || ''} ${shippingInfo.lastName || ''}`.trim();
                if (newName) {
                    user.name = newName;
                }
            }

            await user.save();
            res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, shippingInfo: user.shippingInfo } });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server if not running in a serverless environment (like Vercel)
// Vercel handles the server startup automatically
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const startServer = async () => {
        try {
            await connectDB();
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
            });
        } catch (error) {
            console.error("Failed to start server:", error);
        }
    };
    startServer();
}

module.exports = app;
// Force restart for updates
