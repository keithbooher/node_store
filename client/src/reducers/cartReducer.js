import { FETCH_USER_CART, UPDATE_CART, CONVERT_CART, CREATE_GUEST_CART } from '../actions/types'

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER_CART:
      return action.payload
    case UPDATE_CART:
      return action.payload
    case CONVERT_CART:
      return action.payload
    case CREATE_GUEST_CART:
      return action.payload
    default: 
      return state
  }
}