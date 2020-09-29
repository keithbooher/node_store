const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const discountCodeSchema = new Schema({
  percentage: Number,
  flat_price: Number,
  affect_order_total: {
    type: Boolean,
    default: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'products'
  }],
  active: {
    type: Boolean,
    default: false
  },
  discount_code: String,
  created_at: Date,
})

mongoose.model('discountCodes', discountCodeSchema)