import axios from 'axios'
import { FETCH_USER, FETCH_USER_CART, ALL_PRODUCTS, UPDATE_CART } from './types'

// Handle payment token
export const handleToken = (token) => async dispatch => {
  const res = await axios.post('/api/stripe', token)
  dispatch({ type: FETCH_USER, payload: res.data })
}