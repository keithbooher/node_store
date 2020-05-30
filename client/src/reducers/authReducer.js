import { FETCH_USER, UPDATE_USER, CREATE_GUEST_CART } from '../actions/types'

const guest_user = {
  _id: "000000000000000000000000",
  email: null,
  first_name: null,
  last_name: null,
  photo: String,
  role: "customer",
  billing_address: [],
  shipping_address: []
}

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || guest_user // action.payload is the user model
    case UPDATE_USER:
      return action.payload
    default: 
      return state
  }
}