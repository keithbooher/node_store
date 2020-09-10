const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const AddressSchema = require('./Address')
const LineItemSchema = require('./LineItem')

const rateSchema = new Schema({
  cost: "",
  shipping_rate: "",
  shipping_method: "",
  carrier: ""
})

const shipmentSchema = new Schema({
  billing_address: AddressSchema,
  shipping_address: AddressSchema,
  chosen_rate: rateSchema,
  status: {
    type: String,
    default: 'pending'
  },
  date_shipped: Date,
  line_items: [LineItemSchema],
  _user_id: String,
  tracking: {
    type: Number,
    default: null
  }
})

mongoose.model('shipments', shipmentSchema)

