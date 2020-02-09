const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: String
})

mongoose.model('categorys', categorySchema)