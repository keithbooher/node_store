import { SIDEBAR } from '../actions/types'

export default function(state = null, action) {
  switch (action.type) {
    case SIDEBAR:
      return action.payload
    default: 
      return state
  }
}