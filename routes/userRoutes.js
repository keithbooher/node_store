const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const User = mongoose.model('users')
const Order = mongoose.model('orders')
const Review = mongoose.model('reviews')

module.exports = app => {
  
  app.post('/api/user/email', requireLogin, adminRequired, async (req, res) => {
    try {
      const email = req.body.email
      const user = await User.findOne({ email })
      res.send(user) 
    } catch (err) {
      req.bugsnag.notify(err) 
      res.status(422).send(err)
    }
  })
  
  app.get('/api/users/last_user', requireLogin, adminRequired, async (req, res) => {    
    try {
      const user = await User.findOne({ deleted_at: null })
      res.send(user)
    } catch (err) {
      req.bugsnag.notify(err) 
      res.status(422).send(err)
    }
  })

  app.get('/api/users/:user_id', requireLogin, adminRequired, async (req, res) => {    
    try {
      let user_id = req.params.user_id
      let user
      user = await User.findOne({_id: user_id})
      res.send(user)
    } catch (err) {
      req.bugsnag.notify(err) 
      res.status(422).send(err)
    }
  })

  app.get('/api/users/:last_user_id/:direction', requireLogin, adminRequired, async (req, res) => {  
    try {
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
    } catch (err) {
      req.bugsnag.notify(err) 
      res.status(422).send(err)
    }
  })

  app.put('/api/update/user', requireLogin, async (req, res) => {  
    try {
      let user = req.body.user
      let updated_user = await User.findOneAndUpdate({ _id: user._id }, user, {new: true})
      res.send(updated_user)
    } catch (err) {
      req.bugsnag.notify(err) 
      res.status(422).send(err)
    }
  })

  app.get('/api/user/orders/:user_id/:last_order_id/:direction', requireLogin, async (req, res) => {
    try {
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
    } catch (err) {
      req.bugsnag.notify(err) 
      res.status(422).send(err)
    }
  })


  app.get('/api/review/user/:user_id/:last_review_id/:direction', requireLogin, async (req, res) => {
    try {
      const user_id = req.params.user_id
      let last_review_id = req.params.last_review_id
      let direction = req.params.direction
      let reviews
      if (last_review_id === 'none') {
        reviews = await Review.find({ _user_id: user_id }).sort({_id:-1}).limit(10)
      } else {
        if (direction === "next") {
          reviews = await Review.find({_id: {$lt: last_review_id}, _user_id: user_id}).sort({_id:-1}).limit(10)
        } else {
          reviews = await Review.find({_id: {$gt: last_review_id}, _user_id: user_id}).limit(10)
          reviews = reviews.reverse()
        }
      }
      res.send(reviews)
    } catch (err) {
      req.bugsnag.notify(err)       
      res.status(422).send(err)
    }
  })

}
