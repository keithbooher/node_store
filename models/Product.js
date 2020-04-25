const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const CategorySchema = require('./Category')

const productSchema = new Schema({
  name: String,
  // NEVER EVER EVER EVER CHANGE PATH NAME
  path_name: String,
  description: {
    type: String,
    default: ""
  },
  created_at: Date,
  deleted_at: {
    type: Date,
    default: null
  },
  inventory_count: Number,
  price: Number,
  dimensions: {
    type: Object,
    default: {}
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'categorys'
  }],
  image: String,
  display: {
    type: Boolean,
    default: true
  }
})

mongoose.model('products', productSchema)