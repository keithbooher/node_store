const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const lineItemSchema = new Schema({
  product_name: String,
  image: String,
  _product_id: String,
  quantity: Number,
  product_price: Number,
  product_path: String
})

module.exports = lineItemSchema