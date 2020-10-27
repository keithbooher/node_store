const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Varietal = mongoose.model('varietal')
const VarietalOption = mongoose.model('varietalOption')

module.exports = app => {

  // Varietal Options




  app.post('/api/varietal/option/create', requireLogin, adminRequired, async (req, res) => {  
    const varietal = new VarietalOption(req.body.option)
    try {
      await varietal.save()
      res.send(varietal)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.put('/api/varietal/option/update', requireLogin, adminRequired, async (req, res) => {  
    const varietal = req.body.varietal
    try {
      let updated_varietal = await VarietalOption.findOneAndUpdate({ _id: varietal._id }, varietal, {new: true})
      res.send(updated_varietal)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(401).send({message: err})
    }
  })

  app.get('/api/varietal/option/:_id', async (req, res) => {  
    const _id = req.params._id
    try {
      const varietal = await VarietalOption.findOne({ _id })
      res.send(varietal)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(401).send({message: err})
    }
  })

  app.get('/api/varietals/options/:product_id', async (req, res) => {  
    const _product_id = req.params.product_id
    try {
      const varietals = await VarietalOption.find({ _product_id })
      console.log(varietals)
      res.send(varietals)
      // res.status(401).send({message: "my error bitch"})
    } catch (err) {
      console.log(err)
      req.bugsnag.notify(err)
      res.status(401).send({message: err})
    }
  })



  // Varietals




  app.post('/api/varietal/create', requireLogin, adminRequired, async (req, res) => {  
    const varietal = new Varietal(req.body.varietal)
    try {
      await varietal.save()
      res.send(varietal)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.put('/api/varietal/update', requireLogin, adminRequired, async (req, res) => {  
    const varietal = req.body.varietal
    try {
      let updated_varietal = await Varietal.findOneAndUpdate({ _id: varietal._id }, varietal, {new: true})
      res.send(updated_varietal)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(401).send({message: err})
    }
  })

  app.get('/api/varietal/:_id', async (req, res) => {  
    const _id = req.params._id
    try {
      const varietal = await Varietal.findOne({ _id })
      res.send(varietal)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(401).send({message: err})
    }
  })

  app.get('/api/varietals/:product_id', async (req, res) => {  
    try {
      const varietals = await Varietal.find({})
      res.send(varietals)
      // res.status(401).send({message: "my error bitch"})
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(401).send({message: err})
    }
  })






}