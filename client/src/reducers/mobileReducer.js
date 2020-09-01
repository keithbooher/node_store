import { DEVICE } from '../actions/types'

export default function(state = null, action) {
  switch (action.type) {
    case DEVICE:
      return action.payload
    default: 
      return state
  }
}