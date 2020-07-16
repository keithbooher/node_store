const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const AddressSchema = require('./Address')
const PaymentSchema = require('./Address')

const userSchema = new Schema({
  googleId: String,
  email: String,
  first_name: {
    type: String,
    default: null
  },
  last_name: {
    type: String,
    default: null
  },
  photo: String,
  credits: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    default: "customer"
  },
  billing_address: [AddressSchema],
  shipping_address: [AddressSchema],
  joined_on: Date
})

mongoose.model('users', userSchema)