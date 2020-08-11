import axios from "axios"
import { ERROR } from '../../actions/types'

export const getFAQID = (_id) => async dispatch => {
  let req = await axios.get(`/api/faq/${_id}`).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return {data: {}}
  }
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

export const updateFAQ = (faq) => async dispatch => {
  const data = { faq }
  let req = await axios.put('/api/faq/update', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return faq
  }
}

export const createFAQ = (faq) => async dispatch => {
  const data = { faq }
  let req = await axios.post('/api/faq/create', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return faq
  }
}