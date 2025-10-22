const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { BookingRepository } = require ('../repositories');
const { serverConfig } = require('../config');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const { Enums }= require('../utils/common');
const { CANCELLED , BOOKED}  = Enums.BOOKING_STATUS;


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

async function makePayment(data){
    const EXPIRY_WINDOW_MS = 300000;
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId , transaction);
        if(bookingDetails.status == CANCELLED){
            throw new AppError("The Booking has Expired",StatusCodes.BAD_REQUEST);
        }
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        console.log({bookingTime , currentTime , diff: currentTime - bookingTime});
        if(currentTime - bookingTime > EXPIRY_WINDOW_MS ){
            await cancelBooking(data.bookingId);
            throw new AppError("The Booking has Expired", StatusCodes.BAD_REQUEST);
        }
        if (bookingDetails.totalCost != data.totalCost){
            throw new AppError("The amount of the payment doesn't match",StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.userId != data.userId){
            throw new AppError('Ther user corresponding to the booking does not match', StatusCodes.BAD_REQUEST);
        }
        // We assume the paymeent is successful
        await bookingRepository.update(data.bookingId , {status:BOOKED} , transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelBooking(bookingId){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId , transaction);
        if(bookingDetails.status == CANCELLED){
            await transaction.commit();
            return true;
        }
         await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`,{
            seats: bookingDetails.noOfSeats,
            dec: 0
        });
        await bookingRepository.update(bookingId , {status:CANCELLED} , transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelOldBookings(){
    try {
        const currTime = new Date();
        const response = await bookingRepository.cancelOldBookings(currTime - 300000);
        return response;
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    createBooking,
    makePayment,
    cancelOldBookings
}