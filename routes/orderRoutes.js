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

  app.get('/api/order/:order_id', requireLogin, async (req, res) => {  
    const order_id = req.params.order_id
    const order = await Order.findOne({ "_id": order_id })

    res.send(order)
  })


  app.get('/api/orders/:last_order_id/:direction', requireLogin, async (req, res) => {
    let last_order_id = req.params.last_order_id
    let direction = req.params.direction
    let orders
    if (last_order_id === 'none') {
      orders = await Order.find().limit(10)
    } else {
      if (direction === "next") {
        orders = await Order.find({_id: {$gt: last_order_id}}).limit(10)
      } else {
        orders = await Order.find({_id: {$lt: last_order_id}}).sort({_id:-1}).limit(10)
      }
    }
    res.send(orders)
  })
}