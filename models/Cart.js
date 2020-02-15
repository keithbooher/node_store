const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const LineItemSchema = require('./LineItem')

const cartSchema = new Schema({
  checkout_state: {
    type: String,
    default: "shopping"
  },
  line_items: [LineItemSchema],
  _user_id: String,
  sub_total: Number,
  total: Number
})

mongoose.model('carts', cartSchema)