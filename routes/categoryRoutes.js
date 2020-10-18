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
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.put('/api/category/update', requireLogin, adminRequired, async (req, res) => {  
    const category = req.body.category
    try {
      let updated_category = await Category.findOneAndUpdate({ _id: category._id }, category, {new: true})
      res.send(updated_category)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.put('/api/category/delete', requireLogin, adminRequired, async (req, res) => {  
    try {
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
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    } 
  })

  app.get('/api/category/products/display_order/:id', async (req, res) => {
    try {
      let display_order_key = "category_display_order." + req.params.id
      const products = await Product.find({ "categories": req.params.id, display: true, deleted_at: null }).sort({ [display_order_key]: 1 })
  
      res.send(products)
    } catch (err) {
      console.log(err)
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/category/products/:cat_identifier', async (req, res) => {
    let data = {}
    let display_order_key
    try {
      const category = await Category.findOne({ path_name: req.params.cat_identifier })
      display_order_key = "category_display_order." + category._id
      const products = await Product.find({ "categories": category._id, display: true, deleted_at: null }).sort({ [display_order_key]: 1 }).populate({path: "categories"})
      data = {
        category,
        products,
      }
      res.send(data)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })


  app.get('/api/sitemap/categories', async (req, res) => {
    try {
      const categories = await Category.find({ deleted_at: null })
      res.send(categories)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  // app.get('/api/category/last_product/:path_name', async (req, res) => {
  //   try {
      
  //     res.send(order)
  //   } catch (err) {
  //     req.bugsnag.notify(err)
  //     res.status(422).send(err)
  //   }
  // })

  app.get('/api/categories', requireLogin, adminRequired, async (req, res) => {  
    try {
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
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/categories/top', requireLogin, adminRequired, async (req, res) => {
    try {
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
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/categories/sidebar', async (req, res) => {
    try {
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
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })
}