const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Cart = mongoose.model('carts')

module.exports = app => {
  app.get('/api/cart/:user_id', async (req, res) => {    
    console.log(req.params.user_id)
    const cart = await Cart.findOne({ _user_id: `${req.params.user_id}` })
    console.log('CART', cart)
    res.send(cart)
  })
  // Change to post route
  app.post('/api/cart/create/:user_id', async (req, res) => {  
    const product = req.body.product
    const quantity = req.body.quantity
    const user_id = req.body.user_id
    const sub_total = product.price * .08
    const cart = new Cart({
      line_items: [
        {
          product_name: product.name,
          image: product.image,
          _product_id: product._id,
          quantity: quantity,
          product_price: product.price
        }
      ],
      _user_id: user_id,
      sub_total: sub_total,
      total: sub_total + product.price
    })
    try {
      await cart.save()
      const new_cart = cart
      console.log(cart)
      res.send(cart)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  // ROUTE TO ADD TO ALREADY CREATED CART
}