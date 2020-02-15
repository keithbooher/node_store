import axios from 'axios'
import { FETCH_USER, FETCH_USER_CART, ALL_PRODUCTS, ADD_TO_CART } from './types'

// This is an action creator
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user')
  dispatch({ type: FETCH_USER, payload: res.data })
}

// Find the current user's cart
export const usersCart = (user_id) => async dispatch => {
  const res = await axios.get(`/api/cart/${user_id}`)
  if (res.data === "") {
    res.data = null
  }
  dispatch({ type: FETCH_USER_CART, payload: res.data })
}

// Handle payment token
export const handleToken = (token) => async dispatch => {
  const res = await axios.post('/api/stripe', token)
  dispatch({ type: FETCH_USER, payload: res.data })
}

export const allInstockProducts = () => async dispatch => {
  const res = await axios.get('/api/products/all/instock')
  dispatch({ type: ALL_PRODUCTS, payload: res.data })
}

export const addToCart = (user_id, cart, product, quantity) => async dispatch => {
  let data = {user_id, cart, product, quantity}
  let res
  if (cart === null) {
    res = await axios.post('/api/cart/create/' + user_id, data) 
    dispatch({ type: ADD_TO_CART, payload: res.data })
  } else {
    res = await axios.put('/api/cart/' + user_id, data)
    dispatch({ type: ADD_TO_CART, payload: res.data })
  }
}