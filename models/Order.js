const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const orderSchema = new Schema({
  sub_total: Number,
  total: Number,
  status: {
    type: String,
    default: 'pending'
  },
  date_placed: Date,
  date_canceled: { 
    type: Date,
    default: null
  },
  _user_id: String,
  email: String,
  shipment: {
    type: Schema.Types.ObjectId,
    ref: 'shipments'
  },
  admin_notes: String,
  payment: Object
})

mongoose.model('orders', orderSchema)