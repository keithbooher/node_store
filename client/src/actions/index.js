import { ENLARGE } from './types'
export * from './cart_actions'
export * from './user_actions'
export * from './product_actions'
export * from './payment_actions' 
export * from './sidebar_actions' 


export const dispatchObj = (object) => dispatch => {
  dispatch(object)
}

export const dispatchEnlargeImage = (object) => dispatch => {
  console.log('actions')
  dispatch({type: ENLARGE, payload: object})
}