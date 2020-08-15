import axios from "axios"
import { ERROR } from '../../actions/types'

export const createShipment = (shipment) => async dispatch => {
  const data = { shipment }
  let req = await axios.post('/api/shipment/create', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: shipment}
  }
}

export const updateShipment = (shipment) => async dispatch => {
  const data = { shipment }
  let req = await axios.put('/api/shipment/update', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: shipment}
  }
}