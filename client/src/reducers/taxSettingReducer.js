import { TAX } from '../actions/types'

export default function(state = null, action) {
  switch (action.type) {
    case TAX:
      return action.payload
    default: 
      return state
  }
}