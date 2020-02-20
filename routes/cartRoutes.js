const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Cart = mongoose.model('carts')

module.exports = app => {
  app.get('/api/cart/:user_id', async (req, res) => {    
    const cart = await Cart.findOne({ _user_id: `${req.params.user_id}` })
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
      res.send(cart)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  // ROUTE TO ADD TO ALREADY CREATED CART
  app.put("/api/cart/:cart_id", async (req, res) => {
    const product = req.body.product
    const quantity = req.body.quantity
    const user_id = req.body.user_id
    let cart = req.body.cart
    let sub_total = 0

    // CHECK TO SEE IF PRODUCT IS CONTAINED WITHIN CART ALREADY
    let found = false;
    for(var i = 0; i < cart.line_items.length; i++) {
      if (cart.line_items[i]._product_id == product._id) {
          found = true;
          break;
      }
    }

    // IF FOUND, SIMPLE UPDATE THE LINE ITEM QUANTITY. OTHERWISE CREATE A NEW LINE_ITEM AND PUSH TO THE CART
    if(found === true) {
      cart.line_items.forEach((line_item) => {
        if(product._id === line_item._product_id) {
          line_item.quantity += quantity
        }
      })
    } else {
      let line_item = {
        product_name: product.name,
        image: product.image,
        _product_id: product._id,
        quantity: quantity,
        product_price: product.price
      }
      cart.line_items.push(line_item)
    }


    cart.line_items.forEach((line_item) => {
      sub_total = sub_total + (line_item.product_price * line_item.quantity)
    })
    cart.total = sub_total * .08

    // cart.line_items = []

    let updated_cart = await Cart.findOneAndUpdate({ _id: cart._id }, cart, {new: true})
    res.send(updated_cart)
  });
}