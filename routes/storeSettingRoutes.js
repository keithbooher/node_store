const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const StoreSetting = mongoose.model('storeSettings')


module.exports = app => {
  app.put('/api/setting/update', requireLogin, adminRequired, async (req, res) => {
    try {
      const setting = req.body.setting
      let updated_setting = await StoreSetting.findOneAndUpdate({ _id: setting._id }, setting, {new: true})
      res.send(updated_setting)   
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/all/settings', requireLogin, adminRequired, async (req, res) => {  
    try {
      let settings = await StoreSetting.find({})
      res.send(settings)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    } 
  })

  app.get('/api/product_hiding/setting', async (req, res) => {  
    try {
      let setting = await StoreSetting.findOne({ internal_name : "hide_zero" })
      res.send(setting)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/tax/setting', async (req, res) => {  
    try {
      let setting = await StoreSetting.findOne({ internal_name : "no_tax" })
      res.send(setting)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/setting/home_banner/desktop', async (req, res) => {
    try {
      let setting = await StoreSetting.findOne({ internal_name : "desktop_banner_photo" })
      res.send(setting)
    } catch (err) {
      req.bugsnag.notify(err) 
      res.status(422).send(err)
    }  
  })

  app.get('/api/setting/home_banner/mobile', async (req, res) => {
    try {
      let setting = await StoreSetting.findOne({ internal_name : "mobile_banner_photo" })
      res.send(setting)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/setting/gallery', async (req, res) => {
    try {
      let setting = await StoreSetting.findOne({ internal_name : "show_gallery" })
      res.send(setting)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/setting/carousel', async (req, res) => {
    try {
      let setting = await StoreSetting.findOne({ internal_name : "gallery_carousel" })
      res.send(setting)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.get('/api/setting/about', async (req, res) => {
    try {
      let setting = await StoreSetting.findOne({ internal_name : "about" })
      res.send(setting)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })



  // // Create Store Setting
  // app.get('/api/store_setting/create', async (req, res) => {  
  //   console.log("here")
  //   let setting = {
  //     name:"About",
  //     value: {string: ""},
  //     description:"Write your about me",
  //     internal_name: "about"
  //   }
  //   const storeSetting = new StoreSetting(setting)
  //   try {
  //     await storeSetting.save()
  //     res.send(storeSetting)
  //   } catch (err) {
  //     req.bugsnag.notify(err)
  //     res.status(422).send(err)
  //   }
  // })


}
