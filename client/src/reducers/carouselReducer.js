import { CAROUSEL } from '../actions/types'

export default function(state = false, action) {
  switch (action.type) {
    case CAROUSEL:
      return action.payload
    default: 
      return state
  }
}