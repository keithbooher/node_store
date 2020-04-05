const requireLogin = require('../middlewares/requireLogin')
const mongoose = require('mongoose')
const Review = mongoose.model('reviews')

module.exports = app => {
  app.post('/api/review/create', requireLogin, async (req, res) => {  
    const review = new Review(req.body.review)
    try {
      await review.save()
      console.log(review)
      res.send(review)
    } catch (err) {
      res.status(422).send(err)
    }
  })
  app.put('/api/review/update', requireLogin, async (req, res) => {  
    const review = req.body.review
    let updated_review = await Review.findOneAndUpdate({ _id: review._id }, review, {new: true})
    res.send(updated_review)
  })
  app.get('/api/review/check_exists/:line_item_id', requireLogin, async (req, res) => {  
    const line_item_id = req.params.line_item_id
    const review = await Review.findOne({ "line_item._id": line_item_id })

    res.send(review)
  })
}