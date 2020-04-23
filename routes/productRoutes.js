const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Product = mongoose.model('products')

module.exports = app => {
  // change to post route for admins
  app.post('/api/product/create', requireLogin, adminRequired, async (req, res) => {  
    let new_product = req.body.new_product
    let categories = new_product.category
    let category_id_array = []
    categories.forEach((category) => {
      category_id_array.push(category._id)
    })

    new_product.categories = category_id_array

    let product = new Product(new_product)
    try {
      await product.save()
      res.send(product)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.put('/api/product/update', requireLogin, adminRequired, async (req, res) => {  
    const product = req.body.product
    let updated_product = await Product.findOneAndUpdate({ _id: product._id }, product, {new: true})
    res.send(updated_product)    
  })

  app.get('/api/product/by_path_name/:path_name', async (req, res) => {    
    const product = await Product.findOne({ path_name: req.params.path_name }).populate({path: "category"})
    res.send(product)
  })

  app.get('/api/product/:id', async (req, res) => {    
    const product = await Product.findOne({ _id: req.params.id }).populate({path: "category"})
    res.send(product)
  })

  app.get('/api/products/all/instock', async (req, res) => {    
    const products = await Product.find({ inventory_count: {$gte: 1}, display: true}).populate({
      path: 'category'
    })
    res.send(products)
  })

  app.get('/api/products/all/:last_product_id/:direction', async (req, res) => {   
    let last_product_id = req.params.last_product_id
    let direction = req.params.direction
    let products
    if (last_product_id === 'none') {
      products = await Product.find({}).sort({_id:-1}).limit(10)
    } else {
      if (direction === "next") {
        products = await Product.find({_id: {$lt: last_product_id}}).sort({_id:-1}).limit(10)
      } else {
        products = await Product.find({_id: {$gt: last_product_id}}).limit(10)
        products = products.reverse()
      }
    }
    res.send(products)
  })

}