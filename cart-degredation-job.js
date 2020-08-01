const axios = require('axios')
const keys = require('./config/keys')


const degradeCarts = () => {
  axios.get(`${keys.url}/api/degrade_cart`)
}
degradeCarts()