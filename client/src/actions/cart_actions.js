import axios from 'axios'
import { FETCH_USER_CART, UPDATE_CART, CONVERT_CART, CREATE_GUEST_CART} from './types'

// Find the current user's cart
export const usersCart = (id) => async dispatch => {
  const res = await axios.get(`/api/current/cart/${id}`)
  console.log(res.data)
  if (res.data === "") {
    res.data = null
  }
  dispatch({ type: FETCH_USER_CART, payload: res.data })
  return res.data
}

export const createGuestCart = () => async dispatch => {
  let res = await axios.post('/api/cart/guest/create', {}) 
  dispatch({ type: CREATE_GUEST_CART, payload: res.data })
  return res.data
}

export const convertGuestCart = (guest_cart_id, user_id) => async dispatch => {
  const data = {
    guest_cart_id,
    user_id
  }
  let res = await axios.put(`/api/cart/convert-to-member-cart`, data) 
  dispatch({ type: UPDATE_CART, payload: res.data })
  return res.data
}

export const getGuestCart = (id) => async dispatch => {
  console.log(id)
  let res = await axios.put(`/api/cart/guest/${id}`, {}) 
  dispatch({ type: UPDATE_CART, payload: res.data })
  console.log(res.data)
  return res.data
}

export const createCart = (cart) => async dispatch => {
  let data = { cart }
  let res = await axios.post('/api/cart/create/' + cart._user_id, data) 
  dispatch({ type: UPDATE_CART, payload: res.data })
}

export const updateCart = (cart) => async dispatch => {
  const data = { cart }
  let res = await axios.put('/api/cart/update/' + cart.id, data) 
  dispatch({ type: UPDATE_CART, payload: res.data })
  return res.data
}

export const convertCart = (cart) => async dispatch => {
  dispatch({ type: CONVERT_CART, payload: cart })
}