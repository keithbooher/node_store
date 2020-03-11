import {reset} from 'redux-form'
export * from './cart_actions'
export * from './user_actions'
export * from './product_actions'



export const clearCheckoutForm = () => async dispatch => {
  dispatch(reset('checkoutForm'))
}