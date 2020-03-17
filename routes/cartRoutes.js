const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Cart = mongoose.model('carts')

module.exports = app => {
  // GET A USERS CART
  app.get('/api/cart/:user_id', async (req, res) => {    
    const cart = await Cart.findOne({ _user_id: `${req.params.user_id}`, deleted_at: null })
    res.send(cart)
  })

  // ADD ITEM TO NEW CART
  app.post('/api/cart/create/:user_id', async (req, res) => {  
    const incoming_cart = req.body.cart
    const cart = new Cart(incoming_cart)
    try {
      await cart.save()
      res.send(cart)
    } catch (err) {
      res.status(422).send(err)
    }
  })
  
  // UPDATE EXISTING CART
  app.put("/api/cart/update/:id", async (req, res) => {
    let cart = req.body.cart
    let updated_cart = await Cart.findOneAndUpdate({ _id: cart._id }, cart, {new: true})
    res.send(updated_cart)
  })

}