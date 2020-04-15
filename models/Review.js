const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const LineItemSchema = require('./LineItem')

// Used for both store and product reviews. 
// If a review has no line items it can be assumed that its a store review
const reviewSchema = new Schema({
  rating: Number,
  description: String,
  line_item: Object,
  first_name: String,
  _user_id: String,
  _order_id: String,
  created_at: Date
})

mongoose.model('reviews', reviewSchema)