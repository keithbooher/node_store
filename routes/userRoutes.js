const requireLogin = require('../middlewares/requireLogin')
const mongoose = require('mongoose')
const User = mongoose.model('users')
const Order = mongoose.model('orders')
const Review = mongoose.model('reviews')

module.exports = app => {
  
  app.get('/api/users/last_user', async (req, res) => {    
    const user = await User.findOne({ deleted_at: null })
    res.send(user)
  })

  app.get('/api/users/:user_id', async (req, res) => {    
    let user_id = req.params.user_id
    let user
    user = await User.find({_id: user_id})
    res.send(user)
  })

  app.get('/api/users/:last_user_id/:direction', async (req, res) => {  
    let direction = req.params.direction
    let last_user_id = req.params.last_user_id
    let users
    if (last_user_id === 'none') {
      users = await User.find({}).sort({_id:-1}).limit(10)
    } else {
      if (direction === "next") {
        users = await User.find({_id: {$lt: last_user_id}}).sort({_id:-1}).limit(10)
      } else {
        users = await User.find({_id: {$gt: last_user_id}}).limit(10)
        users = users.reverse()
      }
    }

    res.send(users)
  })

  app.put('/api/update/user', requireLogin, async (req, res) => {  
    let user = req.body.user
    let updated_user = await User.findOneAndUpdate({ _id: user._id }, user, {new: true})
    res.send(updated_user)
  })

  app.get('/api/user/orders/:user_id/:last_order_id/:direction', requireLogin, async (req, res) => {
    let user_id = req.params.user_id
    let last_order_id = req.params.last_order_id
    let direction = req.params.direction
    let orders
    if (last_order_id === 'none') {
      orders = await Order.find({ _user_id: user_id }).populate({
        path: "shipment",
        model: "shipments",
      }).sort({_id:-1}).limit(10)
    } else {
      if (direction === "next") {
        orders = await Order.find({_id: {$lt: last_order_id}, _user_id: user_id}).populate({
          path: "shipment",
          model: "shipments",
        }).sort({_id:-1}).limit(10)
      } else {
        orders = await Order.find({_id: {$gt: last_order_id}, _user_id: user_id}).populate({
          path: "shipment",
          model: "shipments",
        }).limit(10)
        orders = orders.reverse()
      }
    }
    res.send(orders)
  })


  app.get('/api/review/user/:user_id/:last_review_id/:direction', requireLogin, async (req, res) => {  
    const user_id = req.params.user_id
    let last_review_id = req.params.last_review_id
    let direction = req.params.direction
    let reviews
    if (last_review_id === 'none') {
      reviews = await Review.find({ _user_id: user_id }).sort({_id:-1}).limit(2)
    } else {
      if (direction === "next") {
        reviews = await Review.find({_id: {$lt: last_review_id}, _user_id: user_id}).sort({_id:-1}).limit(2)
      } else {
        reviews = await Review.find({_id: {$gt: last_review_id}, _user_id: user_id}).limit(2)
        reviews = reviews.reverse()
      }
    }
    res.send(reviews)
  })

}
