const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Category = mongoose.model('categorys')
const Product = mongoose.model('products')

module.exports = app => {
  // change to post route for when admins are creating categories
  app.get('/api/category/create', requireLogin, adminRequired, async (req, res) => {  
    const category = new Category({
      name: 'test category three',
      path_name: 'test_category_three'
    })

    try {
      await category.save()
      res.send(category)
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
}