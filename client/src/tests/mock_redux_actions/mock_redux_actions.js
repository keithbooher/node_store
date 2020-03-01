import axios from 'axios'
import { UPDATE_CART } from './types'

// We only need to test functional actions right now. 
// No need to test high level actions like fetchUser or inStockProducts that get run on app bootup

export const addToCart = (user_id, cart, product, quantity) => async dispatch => {
  let data = {user_id, cart, product, quantity}
  let res
  // Do work to transform cart.
  // if product isn't already in cart
  // create line_item object
  // else 
  // increase line_item quantity
  // push to cart.line_items array
  dispatch({ type: UPDATE_CART, payload: res.data })
}

export const incrementLineItemQuantity = (operator, cart, line_item) => async dispatch => {
  // Do work to transform cart.
  // match cart.line_item[i] with line_item
  // increase quantity
  dispatch({ type: UPDATE_CART, payload: res.data })
}

export const removeLineItem = (cart, line_item) => async dispatch => {
  // Do work to transform cart.
  // match cart.line_item[i] with line_item
  // delete from cart.line_items array
  dispatch({ type: UPDATE_CART, payload: res.data })
}