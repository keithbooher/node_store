const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const keys = require('./config/keys')

require('./models/User')
require('./models/Category')
require('./models/Product')
require('./models/Cart')
require('./models/Order')
require('./models/Review')
require('./models/Shipment')
require('./models/ShippingMethod')
require('./models/StoreSetting')
require('./models/FAQ')

require('./services/passport')

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const app = express()

app.use(bodyParser.json())
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 *1000,
    keys: [keys.cookieKey]
  })
)
app.use(passport.initialize())
app.use(passport.session())

require('./routes/authRoutes')(app)
require('./routes/userRoutes')(app)
require('./routes/billingRoutes')(app)
require('./routes/categoryRoutes')(app)
require('./routes/reviewRoutes')(app)
require('./routes/productRoutes')(app)
require('./routes/orderRoutes')(app)
require('./routes/cartRoutes')(app)
require('./routes/shipmentRoutes')(app)
require('./routes/shippingMethodRoutes')(app)
require('./routes/mailRoutes')(app)
require('./routes/mailRoutes')(app)
require('./routes/faqRoutes')(app)
require('./routes/storeSettingRoutes')(app)
require('./routes/storeCreationRoutes')(app)

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like our main.js file that the bundle creates
  app.use(express.static('client/build'))
  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT)