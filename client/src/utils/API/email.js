import axios from "axios"
import { ERROR } from '../../actions/types'
import Bugsnag from '@bugsnag/js'

export const orderConfirmation =  (recipient, orderNumber) => async dispatch => {
  let data = { recipient, orderNumber }
  let req = await axios.post(`/api/email/order_confirmation`, data).catch(error => {
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
