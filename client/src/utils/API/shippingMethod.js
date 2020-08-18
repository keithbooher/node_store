import axios from "axios"
import { ERROR } from '../../actions/types'
import Bugsnag from '@bugsnag/js'

export const getShippingMethods = () => async dispatch => {
  let req = await axios.get('/api/shipping_methods').catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: []}
  }
}

export const getShippingMethodForCheckout = () => async dispatch => {
  let req = await axios.get('/api/shipping_methods/checkout').catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}

export const getShippingMethod = (internal_name) => async dispatch => {
  let req = await axios.get(`/api/shipping_methods/${internal_name}`).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}

export const updateShippingMethod = (shipping_method) => async dispatch => {
  const data = { shipping_method }
  let req = await axios.put(`/api/shipping_method/update`, data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}
