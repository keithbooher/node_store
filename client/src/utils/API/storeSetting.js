import axios from "axios"
import { ERROR } from '../../actions/types'

export const updateStoreSetting = (setting) => async dispatch => {
  let data = { setting }
  let req = await axios.put('/api/setting/update', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: setting}
  }
}

export const getAllStoreSettings = () => async dispatch => {
  let req = await axios.get('/api/all/settings').catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: []}
  }
}

export const homeBanner = (device) => async dispatch => {
  let req = await axios.get(`/api/setting/home_banner/${device}`).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}
