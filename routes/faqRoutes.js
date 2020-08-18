const requireLogin = require('../middlewares/requireLogin')
const mongoose = require('mongoose')
const FAQ = mongoose.model('faqs')

module.exports = app => {
  app.post('/api/faq/create', requireLogin, async (req, res) => {  
    const faq = new FAQ(req.body.faq)
    try {
      await faq.save()
      res.send(faq)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.put('/api/faq/update', requireLogin, async (req, res) => {  
    const faq = req.body.faq
    try {
      let updated_faq = await FAQ.findOneAndUpdate({ _id: faq._id }, faq, {new: true})
      res.send(updated_faq)
    } catch (err) {
      res.status(401).send({message: err})
    }
  })

  app.get('/api/faq/:_id', async (req, res) => {  
    const _id = req.params._id
    try {
      const faq = await FAQ.findOne({ _id })
      res.send(faq)
    } catch (err) {
      res.status(401).send({message: err})
    }
  })

  app.get('/api/faqs', async (req, res) => {  
    try {
      const faqs = await FAQ.find({ deleted_at: null })
      res.send(faqs)
      // res.status(401).send({message: "my error bitch"})
    } catch (err) {
      res.status(401).send({message: err})
    }
  })


}