import { SHOW_HEADER } from '../actions/types'

export default function(state = false, action) {
  switch (action.type) {
    case SHOW_HEADER:
      return action.payload
    default: 
      return state
  }
}