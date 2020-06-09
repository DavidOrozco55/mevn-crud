const mongoose = require('mongoose');
const {Schema} = mongoose;

const Task = new Schema({
    name: String,
    hours: String,
    minutes: String
});

module.exports = mongoose.model('Task',Task);