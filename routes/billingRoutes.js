const keys = require('../config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const requireLogin = require('../middlewares/requireLogin')

module.exports = app => {
  app.post('/api/stripe', async (req, res) => {    
    try {
      const charge = await stripe.charges.create({
        amount: 500,
        currency: 'usd',
        description: '$5 for 5 credits',
        source: req.body.id
      })
      res.send(charge)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })
  app.post('/api/stripe/refund', async (req, res) => {    
    try {
      let charge = req.body.charge
      await stripe.refunds.create(
        {charge: charge.id},
        function(err, refund) {
          res.send(refund)
        }
      )
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })
}