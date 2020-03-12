const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const LineItemSchema = require('./LineItem')
const AddressSchema = require('./Address')

const orderSchema = new Schema({
  sub_total: Number,
  total: Number,
  billing_address: AddressSchema,
  shipping_address: AddressSchema,
  status: {
    type: String,
    default: 'pending'
  },
  date_placed: Date,
  date_canceled: { 
    type: Date,
    default: null
  },
  line_items: [LineItemSchema],
  _user_id: String,

})

mongoose.model('orders', orderSchema)