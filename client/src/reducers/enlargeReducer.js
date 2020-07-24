import { ENLARGE } from '../actions/types'

export default function(state = null, action) {
  switch (action.type) {
    case ENLARGE:
      return action.payload
    default: 
      return state
  }
}