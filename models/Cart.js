const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const LineItemSchema = require('./Recipient')

const cartSchema = new Schema({
  checkout_state: String,
  line_items: [LineItemSchema],
  _user_id: { type: Schema.Types.ObjectId, ref: 'User' },
})

mongoose.model('carts', cartSchema)