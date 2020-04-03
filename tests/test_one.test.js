require('../index.js')
const request = require('request')

const url = 'http://localhost:5000/api/cart/5e52a35de58d94155e9af88f'

request.get(url, function (err, response, body) {
  if (response.statusCode === 200) {
    console.log('success')
  } else {
    console.log('fail')
  }
})