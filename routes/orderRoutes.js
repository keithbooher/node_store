const requireLogin = require('../middlewares/requireLogin')
const mongoose = require('mongoose')
const Order = mongoose.model('orders')
const Shipment = mongoose.model('shipments')

module.exports = app => {
  app.post('/api/order/create', async (req, res) => {  
    const order = new Order(req.body.order)
    try {
      await order.save()
      res.send(order)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.put('/api/order/update', requireLogin, async (req, res) => {  
    let order = req.body.order
    let updated_order = await Order.findOneAndUpdate({ _id: order._id }, order, {new: true}).populate({
      path: "shipment",
      model: "shipments",
    })
    res.send(updated_order)
  })

  app.get('/api/order/:order_id', requireLogin, async (req, res) => {  
    const order_id = req.params.order_id
    const order = await Order.findOne({ "_id": order_id }).populate({
      path: "shipment",
      model: "shipments",
    })

    res.send(order)
  })

  app.get('/api/orders/last_order', async (req, res) => {    
    const order = await Order.findOne({ deleted_at: null })
    res.send(order)
  })

  app.get('/api/orders/:last_order_id/:direction/:status', requireLogin, async (req, res) => {
    let last_order_id = req.params.last_order_id
    let direction = req.params.direction
    let status = req.params.status
    let orders
    if (last_order_id === 'none') {

      // making a fresh call with no beginning ID for reference
      if (status === "all") {
        orders = await Order.find({})
          .populate({
            path: "shipment",
            model: "shipments",
          })
          .sort({_id:-1}).limit(10)
      } else {
        orders = await Order.find({ status })
          .populate({
            path: "shipment",
            model: "shipments",
          })
          .sort({_id:-1}).limit(10)
      }

          
    } else {

      if (direction === "next") {

        // if status all, dont distinguish between order statuses
        // otherwise we look for orders with specific statuses
        if (status === "all") {
          orders = await Order.find({_id: {$lt: last_order_id}})
            .populate({
              path: "shipment",
              model: "shipments",
            })
            .sort({_id:-1})
            .limit(10)
        } else {
          orders = await Order.find({_id: {$lt: last_order_id}, status})
            .populate({
              path: "shipment",
              model: "shipments",
            })
            .sort({_id:-1})
            .limit(10)
        }

      } else { // if going in the "previous" direction

        // if status all, dont distinguish between order statuses
        // otherwise we look for orders with specific statuses
        if (status === "all") {
          orders = await Order.find({_id: {$gt: last_order_id}}).populate({
            path: "shipment",
            model: "shipments",
          }).limit(10)
        } else {
          orders = await Order.find({_id: {$gt: last_order_id}, status}).populate({
            path: "shipment",
            model: "shipments",
          }).limit(10)
        }

        orders = orders.reverse()

      }
    }
    res.send(orders)
  })
}