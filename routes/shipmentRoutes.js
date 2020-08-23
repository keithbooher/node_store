const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Shipment = mongoose.model('shipments')
const Product = mongoose.model('products')

module.exports = app => {
  app.post('/api/shipment/create', async (req, res) => {  
    const shipment = new Shipment(req.body.shipment)
    try {
      await shipment.save()
      // reduce inventory numbers
      shipment.line_items.forEach(item => {
        updateQuantity(item)
      });

      res.send(shipment)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  const updateQuantity = async (item) => {
    try {
      let quantity = -1 * parseInt(item.quantity)
      await Product.findOneAndUpdate({ _id: item._product_id }, { $inc: { inventory_count: quantity } }, {new: true})  
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  }

  app.put('/api/shipment/update', requireLogin, adminRequired, async (req, res) => {  
    try {
      const shipment = req.body.shipment
      let updated_shipment = await Shipment.findOneAndUpdate({ _id: shipment._id }, shipment, {new: true})
      res.send(updated_shipment)  
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })
}