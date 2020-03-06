import axios from 'axios'
import { FETCH_USER, FETCH_USER_CART, ALL_PRODUCTS, UPDATE_CART } from './types'

export const allInStockProducts = () => async dispatch => {
  const res = await axios.get('/api/products/all/instock')
  dispatch({ type: ALL_PRODUCTS, payload: res.data })
}