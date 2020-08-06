const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Cart = mongoose.model('carts')

module.exports = app => {
  app.get('/api/degrade_cart', async (req, res) => {
    // Degrade any cart that is greatr that 5 days old to checkout_state: abandoned >
    // - and send out email to customer (except if the cart is already converted or deleted)
    let now = new Date();
    let five_days_ago = new Date(new Date().setDate(new Date().getDate()-5))
    let three_weeks_ago = new Date(new Date().setDate(new Date().getDate()-21))

    let abandonded_carts = await Cart.find(
      { 
        created_at: {
          $gte: three_weeks_ago,
          $lte: five_days_ago
        },
        deleted_at: null,
        checkout_state: { $ne: "complete" }
      }
    )

    abandonded_carts.forEach(async (cart) => {
      let _id = cart._id
      let cartFromDb = await Cart.findOneAndUpdate({_id}, { checkout_state: "abandoned" }, {new: true})
      // TO DO
      // send out emails
    })


    // THEN
    // Degrade any cart that is 2 weeks old to deleted_at: new Date.now()

    Cart.updateMany(
      { 
        created_at: {
          $gt: three_weeks_ago,
        },
        deleted_at: null,
        checkout_state: { $ne: "complete" }
      },
      {
        deleted_at: new Date()
      }
    )

    res.send(200)
  })
  // GET A USERS CART
  app.get('/api/cart/:id', async (req, res) => {
    const _id = req.params.id
    const cart = await Cart.findOne({ _id: _id })
    res.send(cart)
  })
  // GET A USERS CART
  app.get('/api/current/cart/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    const cart = await Cart.findOne({ _user_id: user_id, deleted_at: null })
    res.send(cart)
  })

  // GET A GUEST CART
  app.put('/api/cart/guest/:id', async (req, res) => {
    const cart_id = req.params.id
    // TO DO
    // I'd love to figure out how to tighten this up and say any cart with a status that isn't "complete"
    const cart = await Cart.findOneAndUpdate({ _id: cart_id  }, { _user_id: "000000000000000000000000" }, {new: true})
    res.send(cart)
  })

  // create cart fro admin
  app.post('/api/cart/create', async (req, res) => {  
    const incoming_cart = req.body.cart
    const cart = new Cart(incoming_cart)
    try {
      await cart.save()
      res.send(cart)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  // ADD ITEM TO NEW CART /create 
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
    const email = req.body.email

    let today = new Date()
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()

    // delete previously opened cart if there was one
    let delete_previous_cart = await Cart.findOneAndUpdate({ _user_id: mongoose.Types.ObjectId(_user_id), deleted_at: null  }, { deleted_at: date }, {new: true})

    // assign the new cart the customer is working with to them now
    let updated_cart = await Cart.findOneAndUpdate({ _id: guest_cart_id }, { _user_id, email }, {new: true})

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

  app.get('/api/carts/last_order', async (req, res) => {    
    const cart = await Cart.findOne({ deleted_at: null })
    res.send(cart)
  })

  app.get('/api/carts/:last_cart_id/:direction/:checkout_state', requireLogin, async (req, res) => {
    let last_cart_id = req.params.last_cart_id
    let direction = req.params.direction
    let checkout_state = req.params.checkout_state
    let carts

    // TO DO
    // else if statement to catch checkout_state === (deleted || abandoned)

    if (last_cart_id === 'none') {

      // making a fresh call with no beginning ID for reference
      if (checkout_state === "all") {
        carts = await Cart.find({})
          .sort({_id:-1}).limit(10)
      } else if (checkout_state === "deleted") {
        carts = await Cart.find({ deleted_at: { $ne: null }} )
        .sort({_id:-1}).limit(10)
      } else {
        carts = await Cart.find({ checkout_state })
          .sort({_id:-1}).limit(10)
      }

          
    } else {

      if (direction === "next") {

        // if checkout_state all, dont distinguish between cart checkout_state
        // otherwise we look for carts with specific checkout_state
        if (checkout_state === "all") {
          carts = await Cart.find({_id: {$lt: last_cart_id}})
            .sort({_id:-1})
            .limit(10)
        } else if (checkout_state === "deleted") {
          carts = await Cart.find({_id: {$lt: last_cart_id}, deleted_at: { $ne: null }})
            .sort({_id:-1})
            .limit(10)
        } else {
          carts = await Cart.find({_id: {$lt: last_cart_id}, checkout_state})
            .sort({_id:-1})
            .limit(10)
        }

      } else { // if going in the "previous" direction

        // if checkout_state all, dont distinguish between cart checkout_statees
        // otherwise we look for carts with specific checkout_statees
        if (checkout_state === "all") {
          carts = await Cart.find({_id: {$gt: last_cart_id}}).limit(10)
        } else if (checkout_state === "deleted") {
            carts = await Cart.find({_id: {$gt: last_cart_id}, deleted_at: { $ne: null }}).limit(10)
        } else {
          carts = await Cart.find({_id: {$gt: last_cart_id}, checkout_state}).limit(10)
        }

        carts = carts.reverse()

      }
    }
    res.send(carts)
  })
}