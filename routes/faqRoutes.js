const requireLogin = require('../middlewares/requireLogin')
const mongoose = require('mongoose')
const FAQ = mongoose.model('faqs')

module.exports = app => {
  app.post('/api/faq/create', requireLogin, async (req, res) => {  
    const faq = new FAQ(req.body.faq)
    try {
      await faq.save()
      console.log(faq)
      res.send(faq)
    } catch (err) {
      res.status(422).send(err)
    }
  })

  app.put('/api/faq/update', requireLogin, async (req, res) => {  
    const faq = req.body.faq
    let updated_faq = await FAQ.findOneAndUpdate({ _id: faq._id }, faq, {new: true})
    console.log(updated_faq)
    res.send(updated_faq)
  })

  app.get('/api/faq/:_id', async (req, res) => {  
    const _id = req.params._id
    const faq = await FAQ.findOne({ _id })
    res.send(faq)
  })

  app.get('/api/faqs', async (req, res) => {  
    const faqs = await FAQ.find({ deleted_at: null })
    res.send(faqs)
  })


}