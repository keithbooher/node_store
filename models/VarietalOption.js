const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

// Used for both store and product reviews. 
// If a review has no line items it can be assumed that its a store review or product review
const VarietalOptionSchema = new Schema({
  type: String,
  value: String,
  name: String,
  _product_id: String
})

mongoose.model('varietalOption', VarietalOptionSchema)