import axios from "axios"
import { ERROR } from '../../actions/types'
import Bugsnag from '@bugsnag/js'

export const getCurrentUser = () => async dispatch => {
  let req = await axios.get('/api/current_user').catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: null}
  }
}

export const getUsers = (last_user_id, direction) => async dispatch => {
  let req = await axios.get(`/api/users/${last_user_id}/${direction}`).catch(error => {
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

export const getUser = (id) => async dispatch => {
  let req = await axios.get(`/api/users/${id}`).catch(error => {
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

export const logout = (id) => async dispatch => {
  let req = await axios.get(`/api/logout`).catch(error => {
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

export const lastUser = () => async dispatch => {
  let req = await axios.get('/api/users/last_user').catch(error => {
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

export const updateUser = (user) => async dispatch => {
  const data = { user }
  let req = await axios.put('/api/update/user', data).catch(error => {
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

export const getUserByEmail = (email) => async dispatch => {
  const data = { email }
  let req = await axios.post('/api/user/email', data).catch(error => {
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