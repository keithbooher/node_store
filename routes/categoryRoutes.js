const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Category = mongoose.model('categorys')
const Product = mongoose.model('products')

module.exports = app => {
  // change to post route for when admins are creating categories
  app.post('/api/category/create', requireLogin, adminRequired, async (req, res) => {  
    const category = req.body.category
    
    const new_category = new Category(category)

    try {
      await new_category.save()
      res.send(new_category)
    } catch (err) {
      res.status(422).send(err)
    }
  })
  app.put('/api/category/update', requireLogin, adminRequired, async (req, res) => {  
    const category = req.body.category
    let updated_category = await Category.findOneAndUpdate({ _id: category._id }, category, {new: true})
    res.send(updated_category)    
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
    categories = await Category.find({}).populate({
      path: "sub_categories"
    })
    res.send(categories)
  })
  app.get('/api/categories/top', async (req, res) => {  
    categories = await Category.find({ nest_level: 0 }).populate({
      path: "sub_categories",
      model: "categorys",
      populate: {
        path: 'sub_categories',
        model: "categorys",
        populate: {
          path: 'sub_categories',
          model: "categorys",
          populate: {
            path: 'sub_categories',
            model: "categorys",
            populate: {
              path: 'sub_categories',
              model: "categorys"
            }
          }
        }
      }
    })
    res.send(categories)
  })
}