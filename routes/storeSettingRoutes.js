const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const StoreSetting = mongoose.model('storeSettings')


module.exports = app => {


  app.put('/api/setting/update', requireLogin, adminRequired, async (req, res) => {  
    const setting = req.body.setting
    let updated_product = await StoreSetting.findOneAndUpdate({ _id: setting._id }, setting, {new: true})
    res.send(updated_product)    
  })

  app.get('/api/all/settings', requireLogin, adminRequired, async (req, res) => {  
    let settings = await StoreSetting.find({})
    res.send(settings)    
  })

  app.get('/api/product_hiding/setting', requireLogin, adminRequired, async (req, res) => {  
    let setting = await StoreSetting.findOne({ _id : 1 })
    res.send(setting)    
  })


  // // Create Store Setting
  // app.get('/api/store_setting/create', async (req, res) => {  
  //   console.log("here")
  //   let setting = {
  //     name: "Hide Product If Zero Quantity And Not Backorderable",
  //     boolean: false
  //   }
  //   const storeSetting = new StoreSetting(setting)
  //   try {
  //     await storeSetting.save()
  //     res.send(storeSetting)
  //   } catch (err) {
  //     res.status(422).send(err)
  //   }
  // })
}
