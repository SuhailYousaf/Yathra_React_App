const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    guestno: { type: Number, required: true },
    price: { type: Number, required: true },
    bookin: { type: Date, required: true },
    name: { type: String, requires: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
})

const BookingModel = mongoose.model('Booking', bookingSchema);
module.exports = BookingModel;