const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {type: String, requried: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    uses: {type: Number, default: 0},
    admin: {type: Boolean, default: false},
    token: {type: String}
})

module.exports = mongoose.model('general-users', userSchema)