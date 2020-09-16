const keys = require('../config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const adminRequired = require('../middlewares/adminRequired')

module.exports = app => {
  app.post('/api/stripe', async (req, res) => {    
    try {
      const charge = await stripe.charges.create({
        amount: req.body.amount,
        currency: 'usd',
        description: 'Money For Products',
        source: req.body.token.id
      })
      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: req.body.amount,
      //   currency: 'usd',
      //   description: 'Money For Products',
      //   payment_method_types: ['card'],
      //   transfer_group: '{ORDER10}',
      //   source: req.body.token.id
      // });
      // const transfer = await stripe.transfers.create({
      //   amount: 50,
      //   currency: 'usd',
      //   description: 'Keith's Cut,
      //   destination: '{{CONNECTED_STRIPE_ACCOUNT_ID}}',
      //   transfer_group: '{ORDER10}',
      // });
      res.send(charge)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })
  app.post('/api/stripe/refund', adminRequired, async (req, res) => {    
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
  app.post('/api/stripe/partial/refund', adminRequired, async (req, res) => {    
    try {
      let charge = req.body.charge
      let amount = req.body.amount
      await stripe.refunds.create(
        {
          charge: charge.id,
          amount
        },
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