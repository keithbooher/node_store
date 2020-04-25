const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Category = mongoose.model('categorys')
const Product = mongoose.model('products')

module.exports = app => {
  // change to post route for when admins are creating categories
  app.post('/api/categories/create', requireLogin, adminRequired, async (req, res) => {  
    const category = req.body.category
    
    const new_category = new Category(category)

    try {
      await new_category.save()
      res.send(new_category)
    } catch (err) {
      res.status(422).send(err)
    }
  })
  app.get('/api/category/:path_name', async (req, res) => {    
    category = await Category.findOne({ path_name: req.params.path_name })
    res.send(category)
  })
  app.get('/api/category/products/:category_path_name', async (req, res) => {  
    products = await Product.find({ "category": { $elemMatch: { category_path_name: req.params.category_path_name }}})
    res.send(products)
  })
  app.get('/api/categories', async (req, res) => {  
    categories = await Category.find({})
    res.send(categories)
  })
  app.get('/api/categories/top', async (req, res) => {  
    categories = await Category.find({ top_level: true })
    res.send(categories)
  })
}