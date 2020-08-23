import { ENLARGE, SHOW_CART, SHOW_HEADER, ERROR } from './types'
export * from './cart_actions'
export * from './user_actions'
export * from './product_actions'
export * from './sidebar_actions' 
export * from './store_settings_actions' 


export const dispatchObj = (object) => dispatch => {
  dispatch(object)
}

export const dispatchEnlargeImage = (object) => dispatch => {
  dispatch({type: ENLARGE, payload: object})
}

export const showCartAction = (boolean) => dispatch => {
  dispatch({type: SHOW_CART, payload: boolean})
}

export const showHeaderAction = (value) => dispatch => {
  dispatch({type: SHOW_HEADER, payload: value})
}

export const errorAction = (value) => dispatch => {
  dispatch({type: ERROR, payload: value})
}