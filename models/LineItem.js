const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const varietal = require('./Varietal')

const lineItemSchema = new Schema({
  product_name: String,
  image: String,
  _product_id: String,
  quantity: Number,
  product_price: Number,
  product_path: String,
  gift_note: String,
  discount: Number,
  varietal: varietal,
  use_master_images: {
    type: Boolean,
    default: false
  },
})

module.exports = lineItemSchema