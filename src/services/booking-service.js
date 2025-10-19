const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { SuccessResponse , ErrorResponse } = require('../utils/common');
const { BookingRepository } = require ('../repositories');
const { serverConfig } = require('../config');
const db = require('../models');
const AppError = require('../utils/errors/app-error');


const bookingRepository  = new BookingRepository();

async function createBooking(data){
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        flightData = flight.data.data;
        if( data.noOfSeats > flightData.totalSeats ){
            throw new AppError('Not enough seats available',StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmount = flightData.price * data.noOfSeats;
        const BookingPayLoad = {...data , totalCost: totalBillingAmount}
        await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
            seats: data.noOfSeats
        })
        const booking = await bookingRepository.create(BookingPayLoad , transaction);
        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    createBooking
}