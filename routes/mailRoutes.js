
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys')
const confirmationTemplate = require('../services/emailTemplates/orderConfirmation')
const trackingTemplate = require('../services/emailTemplates/trackingTemplate')
const processingTemplate = require('../services/emailTemplates/processingTemplate')
const ownerTemplate = require('../services/emailTemplates/ownerNotificationTemplate')

module.exports = app => {
  
  app.post('/api/email/order_confirmation', async (req, res) => {
    const { recipient, orderNumber } = req.body

    sgMail.setApiKey(keys.sendgridKey)

    const msg = {
          to: recipient,
          from: 'keibooher@gmail.com', // Use the email address or domain you verified above
          subject: 'Note Store Order Confirmation',
          text: "Just letting you know we've received your order",
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
  
  
  app.post('/api/email/owner', async (req, res) => {
    const { orderNumber } = req.body

    sgMail.setApiKey(keys.sendgridKey)

    const owner_msg = {
          to: 'keibooher@gmail.com',
          from: 'keibooher@gmail.com', // Use the email address or domain you verified above
          subject: 'New Order! KYEO',
          text: "Congrats someone just placed an order with your store!",
          html: ownerTemplate(orderNumber)
        }

    try {
      sgMail.send(owner_msg)
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
          subject: 'Node Store Purchase Shipped',
          text: 'check out your tracking number',
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
          subject: 'Your order is being processed!',
          text: 'Your Node Store purchase is being processed',
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
