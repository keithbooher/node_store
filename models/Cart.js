const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const LineItemSchema = require('./LineItem')
const AddressSchema = require('./Address')


const rateSchema = new Schema({
  cost: "",
  shipping_method: "",
  rate: ""
})

const cartSchema = new Schema({
  checkout_state: {
    type: String,
    default: "shopping"
  },
  line_items: [LineItemSchema],
  email: String,
  _user_id: String,
  sub_total: Number,
  total: Number,
  billing_address: AddressSchema,
  shipping_address: AddressSchema,
  created_at: Date,
  deleted_at: {
    type: Date,
    default: null
  },
  chosen_rate: rateSchema,
  tax: Number
})

mongoose.model('carts', cartSchema)