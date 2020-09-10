
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys')
const confirmationTemplate = require('../services/emailTemplates/orderConfirmation')
const trackingTemplate = require('../services/emailTemplates/trackingTemplate')
const processingTemplate = require('../services/emailTemplates/processingTemplate')

module.exports = app => {
  
  app.post('/api/email/order_confirmation', async (req, res) => {
    const { recipient, orderNumber } = req.body

    sgMail.setApiKey(keys.sendgridKey)

    const msg = {
          to: recipient,
          from: 'keibooher@gmail.com', // Use the email address or domain you verified above
          subject: 'Sending with Twilio SendGrid is Fun',
          text: 'and easy to do anywhere, even with Node.js',
          html: confirmationTemplate(orderNumber)
        }

    try {
      sgMail.send(msg)
      res.send(200)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })
  
  app.post('/api/email/tracking', async (req, res) => {
    const { order } = req.body

    sgMail.setApiKey(keys.sendgridKey)

    const msg = {
          to: recipient,
          from: 'keibooher@gmail.com', // Use the email address or domain you verified above
          subject: 'Sending with Twilio SendGrid is Fun',
          text: 'and easy to do anywhere, even with Node.js',
          html: trackingTemplate(order)
        }

    try {
      sgMail.send(msg)
      res.send(200)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })
  
  app.post('/api/email/processing', async (req, res) => {
    const { order } = req.body

    sgMail.setApiKey(keys.sendgridKey)

    const msg = {
          to: recipient,
          from: 'keibooher@gmail.com', // Use the email address or domain you verified above
          subject: 'Sending with Twilio SendGrid is Fun',
          text: 'and easy to do anywhere, even with Node.js',
          html: processingTemplate(order)
        }

    try {
      sgMail.send(msg)
      res.send(200)
    } catch (err) {
      req.bugsnag.notify(err)
      res.status(422).send(err)
    }
  })

}
