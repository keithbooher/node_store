const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const ShippingMethod = mongoose.model('shippingMethods')

module.exports = app => {
  app.get('/api/shipping_methods', async (req, res) => {
    try {
      let shippingMethods = await ShippingMethod.find({ deleted_at: null })
      res.send(shippingMethods)
    } catch (err) {
      res.status(422).send(err)
    }
  })
  app.get('/api/shipping_methods/checkout', async (req, res) => {
    try {
      let shippingMethods = await ShippingMethod.findOne({ deleted_at: null, display: true })
      res.send(shippingMethods)
    } catch (err) {
      res.status(422).send(err)
    }
  })
  app.get('/api/shipping_methods/:internal_name', async (req, res) => {
    try {
      let internal_name = req.params.internal_name
      let shippingMethod = await ShippingMethod.findOne({ internal_name })
      res.send(shippingMethod)
    } catch (err) {
      res.status(422).send(err)
    }
  })
  app.put('/api/shipping_method/update', requireLogin, adminRequired, async (req, res) => {
    try {
      let shipping_method = req.body.shipping_method
      let shippingMethod = await ShippingMethod.findOneAndUpdate({ _id: shipping_method._id }, shipping_method, {new: true})
      res.send(shippingMethod)
    } catch (err) {
      res.status(422).send(err)
    }
  })
  app.post('/api/shipping_method/create', requireLogin, adminRequired, async (req, res) => {
    let shipping_method = req.body.shipping_method
    const new_shipping_method = new ShippingMethod(shipping_method)
    try {
      await new_shipping_method.save()
      res.send(new_shipping_method)
    } catch (err) {
      res.status(422).send(err)
    }
  })
}