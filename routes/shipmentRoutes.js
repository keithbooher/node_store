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
      let product = await Product.findOne({ _id: item._product_id })
      console.log(item)
      console.log(product)
      if (item.varietal && !product.backorderable) {
        let sum = 0
        product.varietals = product.varietals.map(v => {
          if (v._id === item.varietal._id) {
            console.log("HIIIIII")
            sum += v.inventory_count + quantity
            v.inventory_count = v.inventory_count + quantity
          }
          return v
        })

        product.inventory_count = sum + quantity
        product.save()
        await Product.findOneAndUpdate({ _id: product._id }, product, {new: true})
      } else if (!product.backorderable) {
        product.inventory_count = product.inventory_count + quantity
        await Product.findOneAndUpdate({ _id: product._id }, product, {new: true})
      }
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