const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Review = mongoose.model('reviews')
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
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.put('/api/product/update', requireLogin, adminRequired, async (req, res) => {  
    try {
      const product = req.body.product
      let updated_product = await Product.findOneAndUpdate({ _id: product._id, deleted_at: null }, product, {new: true}).populate({path: "related_products"})
      res.send(updated_product)    
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })
  
  app.put('/api/product/update/many', requireLogin, adminRequired, async (req, res) => {  
    try {
      const products = req.body.products

      products.forEach(async prod => {
        await Product.findOneAndUpdate({ _id: prod._id }, prod, {new: false})
      })

      res.send("complete")    
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/products/home_promotion', async (req, res) => {    
    try {
      const products = await Product.find({ $or: [{ inventory_count: {$gte: 1} }, { backorderable: true } ], display: true, home_promotion: true, deleted_at: null }).populate({
        path: 'categories'
      })
      res.send(products) 
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/all/products', async (req, res) => {    
    try {
      const products = await Product.find({ deleted_at: null }).populate({path: "categories"})
      res.send(products) 
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.post('/api/product/search', requireLogin, adminRequired, async (req, res) => {    
    try {
      let search_term = req.body.term
      const products_by_name = await Product.find({ name: search_term })
      const products_by_sku = await Product.find({ sku: search_term }).populate({path: "categories"})
  
      let products = [...products_by_name, ...products_by_sku]
  
      res.send(products[0])
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/product/by_path_name/:path_name', async (req, res) => {    
    try {
      const product = await Product.findOne({ path_name: req.params.path_name, deleted_at: null }).populate({path: "categories"}).populate({path: "related_products"})
      res.send(product)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.get('/api/product/:id', requireLogin, adminRequired, async (req, res) => {    
    try {
      const product = await Product.findOne({ _id: req.params.id }).populate({path: "categories"}).populate({path: "related_products"})
      res.send(product)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/product/name/:name', requireLogin, adminRequired, async (req, res) => {    
    try {
      const product = await Product.findOne({ name: req.params.name }).populate({path: "categories"})
      res.send(product)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/product/average_rating/:_product_id', async (req, res) => {    
    try {
      const reviews = await Review.find({ _product_id: req.params._product_id })
      let total_reviews = 0
      let total_rating = 0
  
      reviews.forEach((review) => {
        total_rating += review.rating
        total_reviews += 1
      })
  
      let average_rating = {
        average: total_rating / total_reviews
      }
  
      res.status(200).send(average_rating)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/products/gallery', async (req, res) => {    
    try {
      const product = await Product.find({ gallery: true, deleted_at: null }).sort({ gallery_order: 1 }).populate({path: "categories"})
      res.send(product)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/products/last_product', requireLogin, adminRequired, async (req, res) => {    
    try {
      const product = await Product.findOne({ deleted_at: null })
      res.send(product)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.post('/api/products/last_product/by_category', requireLogin, adminRequired, async (req, res) => {
    try {
      let product 
      if (req.body.category === "all" || req.body.category === "none") {
        product = await Product.findOne({ deleted_at: null })
      } else {
        product = await Product.findOne({ deleted_at: null, categories: req.body.category })
      }
      res.send(product)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.post('/api/products/inventory_check', async (req, res) => {   
    try {
      let line_items = req.body.line_items
      checkLineItems(line_items).then(data => {
        res.send(data)
      })
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  const checkLineItems = async (line_items) => {
    try {
      return Promise.all(line_items.map(line_item => {
        return checkProduct(line_item)
      }))
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  }

  const checkProduct = async (line_item) => {
    try {
      const product = await Product.findOne({ _id: line_item._product_id })
      if (line_item.varietal && !product.backorderable) {
        let flagged
        product.varietals.forEach(v => {
          if (v._id === line_item.varietal._id && parseInt(v.inventory_count) < line_item.quantity) {
            line_item.inventory_count = parseInt(product.inventory_count)
            flagged = line_item
          }
        })
        return flagged
      } else if (!product.backorderable && parseInt(product.inventory_count) < line_item.quantity) {
        line_item.inventory_count = parseInt(product.inventory_count)
        return line_item
      }

      return
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  }

  app.get('/api/products/all/:last_product_id/:direction/:category', requireLogin, adminRequired, async (req, res) => {   
    try {
      let last_product_id = req.params.last_product_id
      let direction = req.params.direction
      let category = req.params.category
      let products
  
      if (category === "none" || category === "None" || category === "all" || category === "All") {
        if (last_product_id === 'none') {
          products = await Product.find({ deleted_at: null }).sort({_id:-1}).limit(10)
        } else {
          if (direction === "next") {
            products = await Product.find({_id: {$lt: last_product_id}, deleted_at: null}).sort({_id:-1}).limit(10)
          } else if (direction === "from_here") {
            products = await Product.find({_id: {$lte: last_product_id}, deleted_at: null}).sort({_id:-1}).limit(10)
          }else {
            products = await Product.find({_id: {$gt: last_product_id}, deleted_at: null}).limit(10)
            products = products.reverse()
          }
        }
  
      } else {
        if (last_product_id === 'none') {
          products = await Product.find({ deleted_at: null, categories: category }).sort({_id:-1}).limit(10)
        } else {
          if (direction === "next") {
            products = await Product.find({_id: {$lt: last_product_id}, deleted_at: null, categories: category }).sort({_id:-1}).limit(10)
          } else if (direction === "from_here") {
            products = await Product.find({_id: {$lte: last_product_id}, deleted_at: null, categories: category }).sort({_id:-1}).limit(10)
          }else {
            products = await Product.find({_id: {$gt: last_product_id}, deleted_at: null, categories: category }).limit(10)
            products = products.reverse()
          }
        }
  
      }
  
      res.send(products)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })


  app.get('/api/products/fb_feed', async (req, res) => {    
    try {
      const products = await Product.find({ deleted_at: null }).populate({path: "categories"})
      res.send(products)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  // app.get('/api/products/update/all', async (req, res) => {    
  //   try {

  //     await Product.updateMany({}, {$set : {category_display_order: {} }}, {}, (e, doc) => {
  //       console.log('made it')
  //       console.log(doc)
  //     })

  //     const products = await Product.find({})

  //     products.forEach(async (prod) => {
  //       prod.categories.forEach((cat, index) => {
  //         random = Math.floor(Math.random() * 10000)
  //         prod.category_display_order = {
  //           ...prod.category_display_order,
  //           [cat]: random
  //         }
  //       })
  //       await Product.findOneAndUpdate({ _id: prod._id }, prod, {new: true})
  //     })
      
  //     res.send(products)
  //   } catch (err) {
  //     res.status(422).send(err)
  //   }
  // })


}