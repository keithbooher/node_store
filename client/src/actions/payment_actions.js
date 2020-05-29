import axios from 'axios'
import { FETCH_USER } from './types'

// Handle payment token
export const handleToken = (token) => async dispatch => {
  const res = await axios.post('/api/stripe', token)
  // no longer need to update the user. 
  // This was being done when this was an email app and credits were being subtracted after payment
  // dispatch({ type: FETCH_USER, payload: res.data })
  // return res.data
}