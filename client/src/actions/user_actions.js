import axios from 'axios'
import { FETCH_USER, FETCH_USER_CART, ALL_PRODUCTS, UPDATE_CART } from './types'


// This is an action creator
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user')
  dispatch({ type: FETCH_USER, payload: res.data })
}
