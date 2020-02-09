const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const LineItemSchema = require('./Recipient')

const orderSchema = new Schema({
  total: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    default: 'pending'
  },
  date_placed: Date,
  line_items: [LineItemSchema],
  _user_id: { type: Schema.Types.ObjectId, ref: 'User' },

})

mongoose.model('orders', orderSchema)