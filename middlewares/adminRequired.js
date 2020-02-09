module.exports = (req, res, next) => {
  if(req.user.admin !== true) {
    return res.status(404).send({ error: 'You must be an admin to complete this action' })
  }

  next()
}