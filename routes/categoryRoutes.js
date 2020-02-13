const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Category = mongoose.model('categorys')
const Product = mongoose.model('products')

module.exports = app => {
  app.get('/api/category/create', requireLogin, adminRequired, async (req, res) => {  
    console.log(req.user) 
    console.log('----- made it -----') 
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
  app.get('/api/category/:path_name', (req, res) => {    
    Category.findOne({ path_name: req.params.path_name })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  })
  // REFACTOR AFTER I CHANGE PRODUCT CATEGORY COLUMN TO AN ARRAY OF CATEGORIES
  app.get('/api/category/products/:category_path_name', (req, res) => {  
    Product.find({ "category.category_path_name": req.params.category_path_name} )
    .then(dbModel => {
      res.json(dbModel)
    })
    .catch(err => res.status(422).json(err));
  })
}