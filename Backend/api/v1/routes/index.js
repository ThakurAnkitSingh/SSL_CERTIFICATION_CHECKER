const express = require('express');
const sslCheckerRoutes = require('./ssl'); // Adjust the path if needed

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is healthy',
    });
});

// SSL Checker routes
router.use('/ssl', sslCheckerRoutes);

module.exports = router;
