const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    bookin: { type: Date},
    bookout: { type: Date},
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    count: { type: Number, deafult: 0 },
}, {
    timestamps: true
});

const SlotModel = mongoose.model('Slot', SlotSchema);
module.exports = SlotModel;






