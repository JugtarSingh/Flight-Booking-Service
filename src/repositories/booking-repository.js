const { Booking } = require('../models');
const { Op } = require('sequelize');
const CrudRepository = require('./crud-repository');
const { Enums } = require('../utils/common')
const { BOOKED , CANCELLED  } = Enums.BOOKING_STATUS;



class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }

    async create(data, transaction) {
        const response = await Booking.create(data, { transaction: transaction });
        return response;
    }

    async get(id, transaction) {
        const response = await Booking.findByPk(id, { transaction: transaction });
        return response;
    }

    async update(id, data, transaction) {
        const reponse = await Booking.update(data,
            {
                where: {
                    id: id
                }
            },
            { transaction: transaction });
        return reponse;
    }
    async cancelOldBookings(timeStamp){
        const response = await Booking.update({status : CANCELLED},{
            where: {
                [Op.and]:[
                    {
                        createdAt:{
                            [Op.lt] : timeStamp
                        }
                    },
                    {
                        status:{
                            [Op.ne] : CANCELLED
                        }
                    },
                    {
                        status: {
                            [Op.ne]:BOOKED
                        }
                    }
                ]
            }
        });
        return response;
    }
}


module.exports = BookingRepository;