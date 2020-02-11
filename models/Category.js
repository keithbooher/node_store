const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: String,
  path_name: String,
})

mongoose.model('categorys', categorySchema)