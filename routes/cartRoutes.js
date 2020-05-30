const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Cart = mongoose.model('carts')

module.exports = app => {
  // GET A USERS CART
  app.get('/api/cart/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    const cart = await Cart.findOne({ _user_id: user_id, deleted_at: null })
    res.send(cart)
  })

  // GET A GUEST CART
  app.put('/api/cart/guest/:id', async (req, res) => {
    const cart_id = req.params.id
    console.log("cart_id")
    console.log(cart_id)
    // TO DO
    // I'd love to figure out how to tighten this up and say any cart with a status that isn't "complete"
    const cart = await Cart.findOneAndUpdate({ _id: cart_id  }, { _user_id: "000000000000000000000000" }, {new: true})
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

  // CONVERT GUEST CART TO MEMBER CART
  app.put('/api/cart/convert-to-member-cart', async (req, res) => {  
    const guest_cart_id = req.body.guest_cart_id
    const _user_id = req.body.user_id
    
    let today = new Date()
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()

    // delete previously opened cart if there was one
    let delete_previous_cart = await Cart.findOneAndUpdate({ _user_id: mongoose.Types.ObjectId(_user_id), deleted_at: null  }, { deleted_at: date }, {new: true})

    // assign the new cart the customer is working with to them now
    let updated_cart = await Cart.findOneAndUpdate({ _id: guest_cart_id }, { _user_id }, {new: true})

    res.send(updated_cart)
  })
  

  // Create Guest Cart
  app.post('/api/cart/guest/create', async (req, res) => {  
    let today = new Date()
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    const guest_cart = {
      checkout_state: 'shopping',
      line_items: [],
      _user_id: "000000000000000000000000",
      sub_total: null,
      total: null,
      billing_address: null,
      shipping_address: null,
      shipping_method: null,
      created_at: date,
      deleted_at: null,
      chosen_rate: null,
    }
    const cart = new Cart(guest_cart)
    console.log(cart)
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