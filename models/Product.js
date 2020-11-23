const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const varietal = require('./Varietal')

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
  images: {
    type: Object,
    default: {
      i1: null,
      i2: null,
      i3: null,
      i4: null,
      i5: null,
    }
  },
  use_master_images: {
    type: Boolean,
    default: false
  },
  display: {
    type: Boolean,
    default: false
  },
  gallery: {
    type: Boolean,
    default: false
  },
  gallery_order: {
    type: Number,
    default: 0
  },
  home_promotion:  {
    type: Boolean,
    default: false
  },
  backorderable: {
    type: Boolean,
    default: false
  },
  availability: {
    type: Boolean,
    default: false
  },
  related_products: [{
    type: Schema.Types.ObjectId,
    ref: 'products'
  }],
  meta_title: String,
  meta_description: String,
  meta_keywords: String,
  gift_note: {
    type: Boolean,
    default: false
  },
  category_display_order: {
    type: Object,
    default: {}
  },
  varietals: [varietal]
})



mongoose.model('products', productSchema)