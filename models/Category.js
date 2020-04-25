const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: String,
  // NEVER EVER EVER EVER CHANGE PATH NAME
  path_name: String,
  top_level:{ 
    type: Boolean, 
    default: false
  },
  display_order: Number,
  sub_categories: [{
    type: Schema.Types.ObjectId,
    ref: 'categorys'
  }],
})

mongoose.model('categorys', categorySchema)