const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
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
      res.status(422).send(err)
    }
  })

  app.put('/api/product/update', requireLogin, adminRequired, async (req, res) => {  
    const product = req.body.product
    let updated_product = await Product.findOneAndUpdate({ _id: product._id }, product, {new: true}).populate({path: "related_products"})
    res.send(updated_product)    
  })

  app.get('/api/products/home_promotion', async (req, res) => {    
    const products = await Product.find({ inventory_count: {$gte: 1}, display: true, home_promotion: true }).populate({
      path: 'categories'
    })
    res.send(products)
  })

  app.post('/api/product/search', async (req, res) => {    
    let search_term = req.body.term
    const products_by_name = await Product.find({ name: search_term }).populate({path: "categories"})
    const products_by_sku = await Product.find({ sku: search_term }).populate({path: "categories"})

    let products = [...products_by_name, ...products_by_sku]

    res.send(products[0])
  })

  app.get('/api/product/by_path_name/:path_name', async (req, res) => {    
    const product = await Product.findOne({ path_name: req.params.path_name }).populate({path: "categories"}).populate({path: "related_products"})
    res.send(product)
  })

  app.get('/api/product/:id', async (req, res) => {    
    const product = await Product.findOne({ _id: req.params.id }).populate({path: "categories"}).populate({path: "related_products"})
    res.send(product)
  })

  app.get('/api/product/name/:name', async (req, res) => {    
    const product = await Product.findOne({ name: req.params.name }).populate({path: "categories"})
    res.send(product)
  })

  app.get('/api/products/all/instock', async (req, res) => {    
    const products = await Product.find({ inventory_count: {$gte: 1}, display: true}).populate({
      path: 'categories'
    })
    res.send(products)
  })

  app.get('/api/products/last_product', async (req, res) => {    
    const product = await Product.findOne({ deleted_at: null })
    res.send(product)
  })

  app.post('/api/products/last_product/by_category', async (req, res) => { 
    let product 
    if (req.body.category === "all" || req.body.category === "None") {
      product = await Product.findOne({ deleted_at: null })
    } else {
      product = await Product.findOne({ deleted_at: null, categories: req.body.category })
    }
    res.send(product)
  })

  app.post('/api/products/inventory_check', async (req, res) => {   
    let line_items = req.body.line_items
    checkLineItems(line_items).then(data => {
      res.send(data)
    })
  })

  const checkLineItems = async (line_items) => {
    return Promise.all(line_items.map(line_item => {
      return checkProduct(line_item)
    }))
  }

  const checkProduct = async (line_item) => {
    const product = await Product.findOne({ _id: line_item._product_id })
    if (!product.backorderable && parseInt(product.inventory_count) < line_item.quantity) {
      line_item.inventory_count = parseInt(product.inventory_count)
      return line_item
    }
    return
  }

  app.get('/api/products/all/:last_product_id/:direction/:category', async (req, res) => {   
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
  })

}