const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Product = mongoose.model('products')

module.exports = app => {
  // change to post route for admins
  app.get('/api/product/create', requireLogin, adminRequired, async (req, res) => {  
    let product = new Product({
      name: 'test product two',
      path_name: 'test_product_two',
      description: 'test product two description',
      created_at: Date.now(),
      inventory_count: 1,
      price: 1,
      dimensions: {
        height: 1,
        width: 1,
        depth: 1
      },
      category: [
        {
          _category_id: "5e449d5ed4b97f7709d4dc16",
          category_path_name: "test_category_two",
          category_name: "test category two"
        }
      ],
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.in%2FRolling-Nature-Money-Hybrid-Indoor%2Fdp%2FB00KWS1HO8&psig=AOvVaw3eU69cga1aH-A4PFH4nkX8&ust=1581356497508000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKChmJOCxecCFQAAAAAdAAAAABAG"
    })
    try {
      await product.save()
      res.send(product)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.get('/api/product/:path_name', async (req, res) => {    
    const product = await Product.findOne({ path_name: req.params.path_name })
    res.send(product)
  })

  app.get('/api/products/all/instock', async (req, res) => {    
    const products = await Product.find({ inventory_count: {$gte: 1}, display: true})
    res.send(products)
  })

}