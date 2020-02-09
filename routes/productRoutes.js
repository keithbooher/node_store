const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Product = mongoose.model('products')

module.exports = app => {
  app.get('/api/products/all/instock', requireLogin, adminRequired, async (req, res) => {    
    const products = await Product.find({ inventory_count: {$gte: 1}})
    res.send(products)
  })
  app.get('/api/product/create', requireLogin, adminRequired, async (req, res) => {    
    const product = new Product({
      name: 'test product',
      description: 'test product description',
      created_at: Date.now(),
      inventory_count: 0,
      price: 1,
      dimensions: {
        height: 1,
        width: 1,
        depth: 1
      },
      _category_id: "5e4040fd4f5d294feb520651"
    })

    try {
      await product.save()
      res.send(product)
    } catch (err) {
      res.status(422).send(err)
    }
  })
}