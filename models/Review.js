const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

// Used for both store and product reviews. 
// If a review has no line items it can be assumed that its a store review or product review
const reviewSchema = new Schema({
  rating: Number,
  description: String,
  line_item: Object,
  first_name: String,
  _user_id: String,
  _order_id: String,
  _product_id: String,
  created_at: Date,
  approved: {
    type: Boolean,
    default: false
  }
})

mongoose.model('reviews', reviewSchema)