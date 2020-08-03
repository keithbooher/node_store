import { SHOW_CART } from '../actions/types'

export default function(state = false, action) {
  switch (action.type) {
    case SHOW_CART:
      return action.payload
    default: 
      return state
  }
}