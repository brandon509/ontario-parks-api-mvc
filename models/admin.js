const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, requried: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    admin: {type: Boolean, default: false},
    token: {type: String}
})

module.exports = mongoose.model('admin-users', adminSchema)