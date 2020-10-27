const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const keys = require('./config/keys')
var Bugsnag = require('@bugsnag/js')
var BugsnagPluginExpress = require('@bugsnag/plugin-express')
const expressAttack = require('express-attack')
const requestIp = require('request-ip')

require('./models/User')
require('./models/Category')
require('./models/Product')
require('./models/Cart')
require('./models/Order')
require('./models/Review')
require('./models/Shipment')
require('./models/ShippingMethod')
require('./models/DiscountCode')
require('./models/StoreSetting')
require('./models/Varietal')
require('./models/VarietalOption')
require('./models/FAQ')

require('./services/passport')

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

Bugsnag.start({
  apiKey: keys.EXPRESS_KEY_BUG_SNAG,
  plugins: [BugsnagPluginExpress],
  enabledReleaseStages: [ 'production', 'staging' ]
})

var bugSnagMiddleware = Bugsnag.getPlugin('express')

const app = express()

app.use(bugSnagMiddleware.requestHandler)

app.use(bodyParser.json())
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 *1000,
    keys: [keys.cookieKey]
  })
)

app.use(passport.initialize())
app.use(passport.session())

function throttleByIp(req) {
  const clientIp = requestIp.getClientIp(req)
  return {
    key: clientIp,
    limit: 90,
    period: 60
  }
}
// throttle request when given IP hits 90 times over 60 seconds
app.use(
  expressAttack({
    throttles: [throttleByIp]
  })
)

require('./routes/authRoutes')(app)
require('./routes/userRoutes')(app)
require('./routes/billingRoutes')(app)
require('./routes/categoryRoutes')(app)
require('./routes/reviewRoutes')(app)
require('./routes/productRoutes')(app)
require('./routes/discountCodeRoutes')(app)
require('./routes/orderRoutes')(app)
require('./routes/cartRoutes')(app)
require('./routes/shipmentRoutes')(app)
require('./routes/shippingMethodRoutes')(app)
require('./routes/mailRoutes')(app)
require('./routes/mailRoutes')(app)
require('./routes/faqRoutes')(app)
require('./routes/varietalRoutes')(app)
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

app.use(bugSnagMiddleware.errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT)