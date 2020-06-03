module.exports = (req, res, next) => {
  if(req.user.role !== "admin") {
    return res.status(404).send({ error: 'You must be an admin to complete this action' })
  }

  next()
}