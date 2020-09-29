import axios from "axios"
import { ERROR } from '../../actions/types'
import Bugsnag from '@bugsnag/js'

export const getDiscountCode = (_id) => async dispatch => {
  let req = await axios.get(`/api/discount_code/${_id}`).catch(error => {
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

export const getAllDiscountCodes = () => async dispatch => {
  let req = await axios.get(`/api/discount_codes`).catch(error => {
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

export const updateDiscountCode = (discount_code) => async dispatch => {
  const data = { discount_code }
  let req = await axios.put('/api/discount_code/update', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return { data: discount_code }
  }
}

export const createDiscountCode = (discount_code) => async dispatch => {
  const data = { discount_code }
  let req = await axios.post('/api/discount_code/create', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return discount_code
  }
}