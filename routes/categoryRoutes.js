const requireLogin = require('../middlewares/requireLogin')
const adminRequired = require('../middlewares/adminRequired')
const mongoose = require('mongoose')
const Category = mongoose.model('categorys')

module.exports = app => {
  app.get('/api/category/create', requireLogin, adminRequired, async (req, res) => {  
    console.log(req.user) 
    console.log('----- made it -----') 
    const category = new Category({
      name: 'test category'
    })

    try {
      await category.save()
      res.send(category)
    } catch (err) {
      res.status(422).send(err)
    }
  })
}