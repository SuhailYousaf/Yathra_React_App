const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    firstname: String,
    email: { type: String, unique: true },
    password: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
    googleId: { type: String, required: false },
    status: { type: Boolean, default: true }, 
})

const UserModel = mongoose.model('Users', UserSchema);
module.exports = UserModel;
