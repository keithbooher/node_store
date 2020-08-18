import axios from "axios"
import { ERROR } from '../../actions/types'
import Bugsnag from '@bugsnag/js'

export const getCurrentCart =  (user_id) => async dispatch => {
  let req = await axios.get(`/api/current/cart/${user_id}`).catch(error => {
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

export const getCartByID =  (_id) => async dispatch => {
  let req = await axios.get(`/api/cart/${_id}`).catch(error => {
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

export const updateCart = (cart) => async dispatch => {
  const data = { cart }
  let req = await axios.put('/api/cart/update/' + cart.id, data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return {data: cart}
  }
}

export const createCart = (cart) => async dispatch => {
  const data = { cart }
  let req = await axios.post('/api/cart/create', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
    return req
  } else {
    return {data: cart}
  }
}

export const paginatedCarts = (direction_reference_id, direction, status, search_term) => async dispatch => {
  let req = await axios.get(`/api/carts/${direction_reference_id}/${direction}/${status}/${search_term}`).catch(error => {
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

export const lastCart = (status, search_term) => async dispatch => {
  let req = await axios.get(`/api/carts/last_order/${status}/${search_term}`).catch(error => {
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
