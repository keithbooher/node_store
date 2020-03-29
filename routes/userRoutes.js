const requireLogin = require('../middlewares/requireLogin')
const mongoose = require('mongoose')
const User = mongoose.model('users')

module.exports = app => {
  app.put('/api/update/user', requireLogin, async (req, res) => {  
    let user = req.body.user
    let updated_user = await User.findOneAndUpdate({ _id: user._id }, user, {new: true})
    console.log(updated_user)
    res.send(updated_user)
  })
}