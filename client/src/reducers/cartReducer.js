import { FETCH_USER_CART, ADD_TO_CART } from '../actions/types'

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER_CART:
      return action.payload
    case ADD_TO_CART:
      return action.payload
    default: 
      return state
  }
}