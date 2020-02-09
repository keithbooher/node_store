import { ALL_PRODUCTS } from '../actions/types'

export default function(state = null, action) {
  switch (action.type) {
    case ALL_PRODUCTS:
      return action.payload
    default: 
      return state
  }
}