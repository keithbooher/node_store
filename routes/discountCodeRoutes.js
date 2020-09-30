const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const DiscountCode = mongoose.model('discountCodes')

module.exports = app => {
  app.post('/api/discount_code/create', requireLogin, adminRequired, async (req, res) => {  
    const discount_code = new DiscountCode(req.body.discount_code)
    try {
      await discount_code.save()
      res.send(discount_code)
    } catch (err) {
      console.log(err)
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

  app.put('/api/discount_code/update', requireLogin, adminRequired, async (req, res) => {  
    const discount_code = req.body.discount_code
    try {
      let updated_discount_code = await DiscountCode.findOneAndUpdate({ _id: discount_code._id }, discount_code, {new: true})
        .populate({
          path: "products",
          model: "products",
        })
      res.send(updated_discount_code)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(401).send({message: err})
    }
  })

  app.get('/api/discount_code/:_id', async (req, res) => {  
    const _id = req.params._id
    try {
      const discount_code = await DiscountCode.findOne({ _id })
        .populate({
          path: "products",
          model: "products",
        })
      res.send(discount_code)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(401).send({message: err})
    }
  })

  app.get('/api/discount_codes', async (req, res) => {  
    try {
      const discount_codes = await DiscountCode.find({ deleted_at: null })
        .populate({
          path: "products",
          model: "products",
        })
      res.send(discount_codes)
      // res.status(401).send({message: "my error bitch"})
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(401).send({message: err})
    }
  })


}