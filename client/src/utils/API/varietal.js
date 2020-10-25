import axios from "axios"
import { ERROR } from '../../actions/types'
import Bugsnag from '@bugsnag/js'

export const getVarietalID = (_id) => async dispatch => {
  let req = await axios.get(`/api/varietal/${_id}`).catch(error => {
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

export const getAllVarietals = (product_id) => async dispatch => {
  let req = await axios.get(`/api/varietals/${product_id}`).catch(error => {
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

export const updateVarietal = (varietal) => async dispatch => {
  const data = { varietal }
  let req = await axios.put('/api/varietal/update', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return { data: varietal }
  }
}

export const createVarietal = (varietal) => async dispatch => {
  const data = { varietal }
  let req = await axios.post('/api/varietal/create', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return varietal
  }
}



// Varietal Options




export const getVarietalOptionID = (_id) => async dispatch => {
  let req = await axios.get(`/api/varietal/options/${_id}`).catch(error => {
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


export const createVarietalOption = (option) => async dispatch => {
  const data = { option }
  let req = await axios.post('/api/varietal/option/create', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return option
  }
}

export const updateVarietalOption = (option) => async dispatch => {
  const data = { option }
  let req = await axios.put('/api/varietal/option/update', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return { data: option }
  }
}

export const getAllVarietalOptions = () => async dispatch => {
  let req = await axios.get(`/api/varietals/options`).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  console.log(req)
  if (req.status === 200) {
    return req
  } else {
    return {data: []}
  }
}