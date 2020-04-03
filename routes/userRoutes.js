const requireLogin = require('../middlewares/requireLogin')
const mongoose = require('mongoose')
const User = mongoose.model('users')
const Order = mongoose.model('orders')

module.exports = app => {
  app.put('/api/update/user', requireLogin, async (req, res) => {  
    let user = req.body.user
    let updated_user = await User.findOneAndUpdate({ _id: user._id }, user, {new: true})
    console.log(updated_user)
    res.send(updated_user)
  })

  app.get('/api/user/orders/:user_id/:last_order_id/:direction', requireLogin, async (req, res) => {
    let user_id = req.params.user_id
    let last_order_id = req.params.last_order_id
    let direction = req.params.direction
    let orders
    if (last_order_id === 'none') {
      orders = await Order.find({ _user_id: user_id }).limit(10)
    } else {
      if (direction === "next") {
        orders = await Order.find({_id: {$gt: last_order_id}, _user_id: user_id}).limit(10)
      } else {
        orders = await Order.find({_id: {$lt: last_order_id}, _user_id: user_id}).limit(10)
      }
    }
    res.send(orders)
  })
}