const mongoose = require('mongoose')
const ShippingMethod = mongoose.model('shippingMethods')
const StoreSetting = mongoose.model('storeSettings')
const Category = mongoose.model('categorys')
const Product = mongoose.model('products')

module.exports = app => {

  app.post('/api/store-create/shipping_method/create', async (req, res) => {
    let shipping_method = req.body.shipping_method
    const new_shipping_method = new ShippingMethod(shipping_method)
    try {
      await new_shipping_method.save()
      res.send(new_shipping_method)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.post('/api/store-create/store_setting/create', async (req, res) => {  
    const setting = req.body.store_setting
    const new_setting = new StoreSetting(setting)

    try {
      await new_setting.save()
      res.send(new_setting)
    } catch (err) {
      res.status(422).send(err)
    } 
  })

  app.post('/api/store-create/category/create', async (req, res) => {  
    const category = req.body.category
    
    const new_category = new Category(category)

    try {
      await new_category.save()
      res.send(new_category)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.post('/api/store-create/product/create', async (req, res) => {  
    let new_product = req.body.new_product

    let product = new Product(new_product)
    try {
      await product.save()
      res.send(product)
    } catch (err) {
      res.status(422).send(err)
    }
  })
}
