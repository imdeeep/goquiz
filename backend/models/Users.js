const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const userSchema = new mongoose.Schema({
    userId:{
        type: String,
        default: uuidv4
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const user = mongoose.model('user', userSchema);
module.exports = user;