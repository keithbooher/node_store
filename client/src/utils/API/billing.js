
import axios from "axios"
import { ERROR } from '../../actions/types'

export const handleToken = (token) => async dispatch => {
  let req = await axios.post('/api/stripe', token).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
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
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return {data: {}}
  }
}