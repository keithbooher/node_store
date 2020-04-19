const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Product = mongoose.model('products')

module.exports = app => {
  // change to post route for admins
  app.post('/api/product/create', requireLogin, adminRequired, async (req, res) => {  
    let new_product = req.body.new_product
    let product = new Product(new_product)
    try {
      await product.save()
      res.send(product)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.get('/api/product/:path_name', async (req, res) => {    
    const product = await Product.findOne({ path_name: req.params.path_name })
    res.send(product)
  })

  app.get('/api/products/all/instock', async (req, res) => {    
    const products = await Product.find({ inventory_count: {$gte: 1}, display: true})
    res.send(products)
  })

  app.get('/api/products/all/:last_product_id/:direction', async (req, res) => {   
    let last_product_id = req.params.last_product_id
    let direction = req.params.direction
    let products
    if (last_product_id === 'none') {
      products = await Product.find({}).sort({_id:-1}).limit(2)
    } else {
      if (direction === "next") {
        products = await Product.find({_id: {$lt: last_product_id}}).sort({_id:-1}).limit(2)
      } else {
        products = await Product.find({_id: {$gt: last_product_id}}).limit(2)
        products = products.reverse()
      }
    }
    res.send(products)
  })

}