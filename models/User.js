const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const userSchema = new Schema({
  googleId: String,
  credits: {
    type: Number,
    default: 0
  },
  admin: {
    type: Boolean,
    default: false
  },
  billing_address: {
    type: Object,
    default: null
  },
  shipping_address: {
    type: Object,
    default: null
  },
  joined_on: Date,
  first_name: {
    type: String,
    default: null
  },
  last_name: {
    type: String,
    default: null
  },
})

mongoose.model('users', userSchema)