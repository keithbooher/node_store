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

  app.get('/api/user/orders/:user_id', requireLogin, async (req, res) => {
    let user_id = req.params.user_id
    let last_order_id = req.body.last_order_id
    console.log(last_order_id)
    console.log(user_id)
    if (last_order_id === undefined) {
      const orders = await Order.find({ _user_id: user_id }).limit(10)
      console.log(orders)
      res.send(orders)
    } else {
      const orders = await Order.find({_user_id: {$gt: last_order_id}}).limit(10)
      res.send(orders)
    }
  })
}