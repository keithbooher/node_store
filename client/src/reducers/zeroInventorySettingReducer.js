import { ZERO_INVETORY, TAX } from '../actions/types'

export default function(state = null, action) {
  switch (action.type) {
    case ZERO_INVETORY:
      return action.payload
    default: 
      return state
  }
}