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

  app.get('/api/review/product/last_review/:product_id', async (req, res) => {  
    const _product_id = req.params.product_id
    const review = await Review.findOne({ _product_id })
    res.send(review)
  })

  app.get('/api/review/check_exists/:line_item_id', requireLogin, async (req, res) => {  
    const line_item_id = req.params.line_item_id
    const review = await Review.findOne({ "line_item._id": line_item_id })

    res.send(review)
  })
  app.get('/api/reviews/product/:product_id/:direction/:last_review_id', requireLogin, async (req, res) => {  
    const product_id = req.params.product_id
    const direction = req.params.direction
    const last_review_id = req.params.last_review_id
    let reviews = await Review.find({ _product_id: product_id, approved: true })
    if (last_review_id === 'none') {
      reviews = await Review.find({ approved: true }).sort({_id:-1}).limit(10)
    } else {
      if (direction === "next") {
        reviews = await Review.find({_id: {$lt: last_review_id}, _product_id: product_id, approved: true}).sort({_id:-1}).limit(10)
      } else {
        reviews = await Review.find({_id: {$gt: last_review_id}, _product_id: product_id, approved: true}).limit(10)
        reviews = reviews.reverse()
      }
    }
    res.send(reviews)
  })



  app.get('/api/reviews/:last_review_id/:direction/:approval', requireLogin, async (req, res) => {
    let last_review_id = req.params.last_review_id
    let direction = req.params.direction
    let approval = req.params.approval
    let reviews

    switch (approval) {
      case "approved":
        if (last_review_id === 'none') {
          reviews = await Review.find({ approved: true }).sort({_id:-1}).limit(10)
        } else {
          if (direction === "next") {
            reviews = await Review.find({_id: {$lt: last_review_id, approved: true}}).sort({_id:-1}).limit(10)
          } else {
            reviews = await Review.find({_id: {$gt: last_review_id, approved: true}}).limit(10)
            reviews = reviews.reverse()
          }
        }
        break;
    
      case "unapproved":
        if (last_review_id === 'none') {
          reviews = await Review.find({ approved: false }).sort({_id:-1}).limit(10)
        } else {
          if (direction === "next") {
            reviews = await Review.find({_id: {$lt: last_review_id, approved: false }}).sort({_id:-1}).limit(10)
          } else {
            reviews = await Review.find({_id: {$gt: last_review_id, approved: false }}).limit(10)
            reviews = reviews.reverse()
          }
        }
        break;
    
      default:
        if (last_review_id === 'none') {
          reviews = await Review.find().sort({_id:-1}).limit(10)
        } else {
          if (direction === "next") {
            reviews = await Review.find({_id: {$lt: last_review_id}}).sort({_id:-1}).limit(10)
          } else {
            reviews = await Review.find({_id: {$gt: last_review_id}}).limit(10)
            reviews = reviews.reverse()
          }
        }
        break;
    }
    res.send(reviews)
  })
}