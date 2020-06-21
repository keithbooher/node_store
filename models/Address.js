const mongoose = require('mongoose')
const { Schema } = mongoose // EQUIVALENT TO ----->  const Schema = mongoose.Schema

const AddressSchema = new Schema({
  first_name: String,
  last_name: String,
  company: String,
  street_address_1: String,
  street_address_2: String,
  city: String,
  state: String,
  zip_code: String,
  phone_number: String,
  country: String,
  bill_or_ship: String,
  _user_id: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = AddressSchema