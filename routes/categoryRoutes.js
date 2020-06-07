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
  app.get('/api/category/products/:category_path_name', async (req, res) => {
    category = await Category.findOne({ path_name: req.params.category_path_name })
    products = await Product.find({ "categories": category._id })

    const data = {
      category,
      products
    }

    res.send(data)
  })
  app.get('/api/categories', async (req, res) => {  
    categories = await Category.find({ deleted_at: null }).populate({
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
  app.get('/api/categories/top', async (req, res) => {
    categories = await Category.find({ nest_level: 0, deleted_at: null }).populate({
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
  app.get('/api/categories/sidebar', async (req, res) => {
    categories = await Category.find({ 
      nest_level: 0,
      deleted_at: null,
      display: true
    }).populate({
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