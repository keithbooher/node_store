import axios from "axios"
import { ERROR } from '../../actions/types'

export const getFAQID = (_id) => {
  return axios.get(`/api/faq/${_id}`)
}

export const getAllFAQs = () => async dispatch => {
  let req = await axios.get(`/api/faqs`).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return {data: []}
  }
}

export const updateFAQ = (faq) => {
  const data = { faq }
  return axios.put('/api/faq/update', data) 
}

export const createFAQ = (faq) => {
  const data = { faq }
  return axios.post('/api/faq/create', data) 
}