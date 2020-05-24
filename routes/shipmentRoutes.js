const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Shipment = mongoose.model('shipments')

module.exports = app => {
  app.post('/api/shipment/create', requireLogin, async (req, res) => {  
    const shipment = new Shipment(req.body.shipment)
    try {
      await shipment.save()
      res.send(shipment)
    } catch (err) {
      res.status(422).send(err)
    }
  })
}