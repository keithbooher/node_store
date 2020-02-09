const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const productSchema = new Schema({
  name: String,
  description: {
    type: String,
    default: ""
  },
  created_at: Date,
  inventory_count: Number,
  price: Number,
  dimensions: {
    type: Object,
    default: {}
  },
  _category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
  image: String
})

mongoose.model('products', productSchema)