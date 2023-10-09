const mongoose = require('mongoose')
const { Schema } = mongoose;


const TourSchema = new Schema({
    title: String,
    city: String,
    price: String,
    dayone: String,
    daytwo: String,
    maxGroupSize: Number,
    description: String,
    category: String,
    name: String,
    creator: String,
    tags: [String],
    images: [String],
    createdAt: {
        type: Date,
        default: new Date(),
    },
    likeCount: {
        type: Number,
        default: 0
    },
    status: { type: Boolean, default: true }, 

})
const TourModel = mongoose.model('Tour', TourSchema);
module.exports = TourModel;
