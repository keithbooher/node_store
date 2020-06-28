const mongoose = require('mongoose')
const ShippingMethod = mongoose.model('shippingMethods')

module.exports = app => {
  app.get('/api/shipping_methods', async (req, res) => {
    let shippingMethods = await ShippingMethod.find({ deleted_at: null })
    res.send(shippingMethods)
  })
  app.get('/api/shipping_methods/:internal_name', async (req, res) => {
    let internal_name = req.params.internal_name
    let shippingMethod = await ShippingMethod.findOne({ internal_name })
    res.send(shippingMethod)
  })
  app.put('/api/shipping_method/update', async (req, res) => {
    let shipping_method = req.body.shipping_method
    let shippingMethod = await ShippingMethod.findOneAndUpdate({ _id: shipping_method._id }, shipping_method, {new: true})
    res.send(shippingMethod)
  })
}