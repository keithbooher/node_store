const keys = require('../config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const adminRequired = require('../middlewares/adminRequired')

module.exports = app => {
  app.post('/api/stripe/intent', async (req, res) => {    
    try {
      const intent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        payment_method_types: ['card'],
        application_fee_amount: 50,
        on_behalf_of: 'acct_1HTynxEBKanBaKNJ',
        transfer_data: {
          destination: 'acct_1HTynxEBKanBaKNJ',
        },
      })

      const charge = await stripe.paymentIntents.confirm(intent.id, { payment_method: req.body.payment_method.paymentMethod.id })

      res.send(charge)
    } catch (err) {
      console.log(err)
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