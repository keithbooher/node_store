const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Category = mongoose.model('categorys')
const Product = mongoose.model('products')

module.exports = app => {
  app.post('/api/category/create', requireLogin, adminRequired, async (req, res) => {  
    console.log(req.user) 
    console.log('----- made it -----') 
    const category = new Category({
      name: 'test category'
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
  })
  app.get('/api/category/products/:category_path_name', (req, res) => {  
    console.log(req.params.category_path_name)
    Product.find({ "category.category_path_name": req.params.category_path_name} )
    .then(dbModel => {
      console.log(dbModel)
      res.json(dbModel)
    })
    .catch(err => res.status(422).json(err));
  })
}