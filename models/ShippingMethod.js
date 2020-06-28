const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const shippingRateSchema = new Schema({
  name: String, 
  description: String, 
  effector: Number,
  display: Boolean
})

const shippingMethodSchema = new Schema({
  name: String,
  internal_name: String,
  shipping_rates: [shippingRateSchema],
  display: Boolean
})



mongoose.model('shippingMethods', shippingMethodSchema)
