const mongoose = require('mongoose')

const parkSchema = new mongoose.Schema({
    name: {type: String, required: true, lowercase: true, unique: true},
    location: {type: String, required: true, lowercase: true},
    address: {type: String, required: true, lowercase: true},
    region: {type: String, required: true, lowercase: true},
    size: {type: String, required: true, lowercase: true},
    yearEstablished: {type: String, required: true, lowercase: true},
    phoneNumber: {type: String, required: true, lowercase: true}
})

module.exports = mongoose.model('parks', parkSchema)