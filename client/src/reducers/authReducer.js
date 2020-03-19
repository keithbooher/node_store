import { FETCH_USER, UPDATE_USER } from '../actions/types'

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false // action.payload is the user model
    case UPDATE_USER:
      return action.payload
    default: 
      return state
  }
}