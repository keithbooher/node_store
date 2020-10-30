const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema
const varietalOption = require('./VarietalOption')


const VarietalSchema = new Schema({
  size: varietalOption,
  color: varietalOption,
  inventory_count: Number,
  _product_id: String,
  images: {
    type: Object,
    default: {
      useMasterPhotos: false,
      i1: null,
      i2: null,
      i3: null,
      i4: null,
      i5: null,
    }
  },
  deleted_at: Date,
})

mongoose.model('varietal', VarietalSchema)
