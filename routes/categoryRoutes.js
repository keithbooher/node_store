const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Category = mongoose.model('categorys')
const Product = mongoose.model('products')
const ObjectId = mongoose.Types.ObjectId

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

  app.put('/api/category/delete', requireLogin, adminRequired, async (req, res) => {  
    const category = req.body.category
    await Category.findOneAndUpdate({ _id: category._id }, category)
    let parent_category = await Category.findOneAndUpdate(
      { "sub_categories": category._id },
      { $pull: { "sub_categories": category._id } },
      {new: true}
      ).populate({
      path: "sub_categories",
      model: "categorys"
    })

    parent_category.sub_categories.forEach(async (sub_category) => {
      if (sub_category.display_order > category.display_order) {
          let display_order = sub_category.display_order - 1
          await Category.findOneAndUpdate({ _id: sub_category._id }, { display_order: display_order }, {new: true})
      }
    })

    const categories = await Category.find({ nest_level: 0, deleted_at: null }).populate({
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

  app.get('/api/category/products/:category_path_name', async (req, res) => {
    const category = await Category.findOne({ path_name: req.params.category_path_name })
    const products = await Product.find({ "categories": category._id })
    const data = {
      category,
      products
    }

    res.send(data)
  })

  app.get('/api/categories', async (req, res) => {  
    const categories = await Category.find({ deleted_at: null }).populate({
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
    const categories = await Category.find({ nest_level: 0, deleted_at: null }).populate({
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
    const categories = await Category.find({ 
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