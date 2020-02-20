import axios from 'axios'
import { FETCH_USER, FETCH_USER_CART, ALL_PRODUCTS, UPDATE_CART } from './types'

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

export const allInStockProducts = () => async dispatch => {
  const res = await axios.get('/api/products/all/instock')
  dispatch({ type: ALL_PRODUCTS, payload: res.data })
}

export const addToCart = (user_id, cart, product, quantity) => async dispatch => {
  let data = {user_id, cart, product, quantity}
  let res
  if (cart === null) {
    res = await axios.post('/api/cart/create/' + user_id, data) 
    dispatch({ type: UPDATE_CART, payload: res.data })
  } else {
    res = await axios.put('/api/cart/' + cart._id, data)
    console.log(res.data)
    dispatch({ type: UPDATE_CART, payload: res.data })
  }
}

export const incrementLineItemQuantity = (operator, cart, line_item) => async dispatch => {
  let data = {operator, cart, line_item}
  let res = await axios.put('/api/cart/line_item/update/quantity/' + cart._id, data) 
  dispatch({ type: UPDATE_CART, payload: res.data })
}