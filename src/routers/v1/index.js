const express =require('express');
const router =express.Router();
const { InfoController } = require('../../controllers');
const BookingRoutes = require('./booking-routes');

router.use('/bookings',BookingRoutes);
router.get('/info',InfoController.info);

module.exports = router;