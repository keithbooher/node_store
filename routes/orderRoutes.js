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
}