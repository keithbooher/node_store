const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const FAQSchema = new Schema({
  question: String,
  answer: String,
  deleted_at: {
    type: Date,
    default: null
  }
})

mongoose.model('faqs', FAQSchema)