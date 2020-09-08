
import axios from "axios"
import { ERROR } from '../../actions/types'
import Bugsnag from '@bugsnag/js'

export const handleToken = (token) => async dispatch => {
  let req = await axios.post('/api/stripe', token).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return {data: {}}
  }
}

export const handleRefund = (charge) => async dispatch => {
  let req = await axios.post('/api/stripe/refund', {charge}).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return {data: {}}
  }
}

export const handlePartialRefund = (charge, amount) => async dispatch => {
  let req = await axios.post('/api/stripe/partial/refund', { charge, amount  }).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return {data: {}}
  }
}