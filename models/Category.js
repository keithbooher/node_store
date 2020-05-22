const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: String,
  // NEVER EVER EVER EVER CHANGE PATH NAME
  path_name: String,
  nest_level: Number,
  display_order: Number,
  sub_categories: [{
    type: Schema.Types.ObjectId,
    ref: 'categorys'
  }],
  created_at: Date,
  deleted_at: Date
})

mongoose.model('categorys', categorySchema)