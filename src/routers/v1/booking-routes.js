const { BookingController } = require('../../controllers');
const express = require('express');
const router = express.Router();


// /api/v1/bookings  POST
router.post(
    '/',
    BookingController.createBooking
)

// /api/v1/bookings/payments   GET
router.get(
    '/payments',
    BookingController.makePayment
)

module.exports = router;