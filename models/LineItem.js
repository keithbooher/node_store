const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const lineItemSchema = new Schema({
  _product_id: Number,
  quantity: Number,
  product_price: Number
})

module.exports = lineItemSchema