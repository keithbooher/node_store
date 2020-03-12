const requireLogin = require('../middlewares/requireLogin')
const mongoose = require('mongoose')
const Order = mongoose.model('orders')

module.exports = app => {
  app.post('/api/order/create', requireLogin, async (req, res) => {  
    console.log(req.body.order)
    const order = new Order(req.body.order)
    console.log(order)
    try {
      await order.save()
      console.log(order)
      res.send(order)
    } catch (err) {
      res.status(422).send(err)
    }
  })
}