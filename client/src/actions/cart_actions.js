import axios from 'axios'
import { FETCH_USER, FETCH_USER_CART, ALL_PRODUCTS, UPDATE_CART } from './types'

// Find the current user's cart
export const usersCart = (user_id) => async dispatch => {
  const res = await axios.get(`/api/cart/${user_id}`)
  if (res.data === "") {
    res.data = null
  }
  dispatch({ type: FETCH_USER_CART, payload: res.data })
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

export const removeLineItem = (cart, line_item) => async dispatch => {
  console.log(cart)
  console.log(line_item)
  let data = {cart, line_item}
  let res = await axios.put('/api/cart/line_item/remove/' + cart._id, data) 
  dispatch({ type: UPDATE_CART, payload: res.data })
}

export const updateCheckoutState = (checkout_state, cart_id) => async dispatch => {
  let res = await axios.put('/api/cart/line_item/remove/' + cart_id, checkout_state) 
  dispatch({ type: UPDATE_CART, payload: res.data })
}