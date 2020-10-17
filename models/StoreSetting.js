const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema


const storeSettingSchema = new Schema({
  name: String,
  description: String,
  value: Object,
  internal_name: String
})

mongoose.model('storeSettings', storeSettingSchema)