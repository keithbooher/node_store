const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Cart = mongoose.model('carts')

module.exports = app => {
  app.get('/api/cart/:user_id', async (req, res) => {    
    const cart = await Cart.findOne({ _user_id: `${req.params.user_id}` })
    res.send(cart)
  })

  // ADD ITEM TO NEW CART
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

  // ADD TO ALREADY CREATED CART FROM "ADD TO CART" BUTTON
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

    let updated_cart = await Cart.findOneAndUpdate({ _id: cart._id }, cart, {new: true})
    res.send(updated_cart)
  });

  // UPDATE LINE ITEM QUANTITY
  app.put("/api/cart/line_item/update/quantity/:cart_id", async (req, res) => {
    const updated_line_item = req.body.line_item
    let cart = req.body.cart
    let operator = req.body.operator
    let sub_total = 0

    cart.line_items.forEach((line_item) => {
      if(updated_line_item._product_id === line_item._product_id && operator === 'addition') {
        line_item.quantity += 1
      } else if (updated_line_item._product_id === line_item._product_id && operator === 'subtraction') {
        line_item.quantity += -1
      }
    })

    let removed_zero_quantity_items = cart.line_items.filter((line_item) => line_item.quantity > 0 )
    cart.line_items = removed_zero_quantity_items
    
    cart.line_items.forEach((line_item) => {
      sub_total = sub_total + (line_item.product_price * line_item.quantity)
    })

    cart.total = sub_total * .08

    let updated_cart = await Cart.findOneAndUpdate({ _id: cart._id }, cart, {new: true})
    res.send(updated_cart)
  });

  // REMOVE LINE ITEM FROM CART
  app.put("/api/cart/line_item/remove/:cart_id", async (req, res) => {
    const incomingLineItem = req.body.line_item
    const cart = req.body.cart
    const current_cart_line_items = cart.line_items
    let cart_id = req.params.cart_id
    let sub_total = 0    

    let updated_line_items = current_cart_line_items.filter((line_item) => {
      return incomingLineItem._id !== line_item._id
    })
    cart.line_items = updated_line_items

    cart.line_items.forEach((line_item) => {
      sub_total = sub_total + (line_item.product_price * line_item.quantity)
    })

    cart.total = sub_total * .08

    let updated_cart = await Cart.findOneAndUpdate({ _id: cart_id }, cart, {new: true})
    res.send(updated_cart)
  });

  app.put("/api/cart/update/:id", async (req, res) => {
    let cart = req.body.cart
    let updated_cart = await Cart.findOneAndUpdate({ _id: cart._id }, cart, {new: true})
    res.send(updated_cart)
  })
}