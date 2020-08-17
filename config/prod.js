// prod.js - production keys here!!!
module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: 'redirected',
  REACT_APP_STRIPE_KEY: process.env.REACT_APP_STRIPE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  sendgridKey: process.env.SENDGRID_KEY,
  url: process.env.url,
}