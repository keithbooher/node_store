const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const CategorySchema = require('./Category')

const productSchema = new Schema({
  name: String,
  // NEVER EVER EVER EVER CHANGE PATH NAME
  path_name: String,
  sku: String,
  short_description: {
    type: String,
    default: ""
  },
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
  weight: Number,
  dimensions: {
    type: Object,
    default: {
      height: null,
      width: null,
      depth: null
    }
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'categorys'
  }],
  image: String,
  display: {
    type: Boolean,
    default: false
  },
  home_promotion:  {
    type: Boolean,
    default: false
  },
  backorderable: {
    type: Boolean,
    default: false
  },
  related_products: [{
    type: Schema.Types.ObjectId,
    ref: 'products'
  }],
  meta_title: String,
  meta_description: String,
  meta_keywords: String
})

mongoose.model('products', productSchema)