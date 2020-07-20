export * from './cart_actions'
export * from './user_actions'
export * from './product_actions'
export * from './payment_actions' 
export * from './sidebar_actions' 


export const dispatchObj = (object) => dispatch => {
  dispatch(object)
}