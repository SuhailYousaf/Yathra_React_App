const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    desc: String,
    status: { type: Boolean, default: true },
}, {
    timestamps: true
});

const ReviewModel = mongoose.model('Review', ReviewSchema);
module.exports = ReviewModel;