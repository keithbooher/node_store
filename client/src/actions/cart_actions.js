import axios from 'axios'
import { FETCH_USER_CART, UPDATE_CART, CONVERT_CART} from './types'

// Find the current user's cart
export const usersCart = () => async dispatch => {
  const res = await axios.get(`/api/cart`)
  if (res.data === "") {
    res.data = null
  }
  dispatch({ type: FETCH_USER_CART, payload: res.data })
}

export const addToCart = (create_boolean, cart, user_id) => async dispatch => {
  let data = { cart }
  let res
  if (create_boolean === true) {
    res = await axios.post('/api/cart/create/' + user_id, data) 
  } else {
    res = await axios.put('/api/cart/update/' + cart._id, data)
  }
  dispatch({ type: UPDATE_CART, payload: res.data })
}

export const updateCart = (cart) => async dispatch => {
  const data = { cart }
  let res = await axios.put('/api/cart/update/' + cart.id, data) 
  console.log(res.data)
  dispatch({ type: UPDATE_CART, payload: res.data })
}

export const convertCart = (cart) => async dispatch => {
  dispatch({ type: CONVERT_CART, payload: cart })
}