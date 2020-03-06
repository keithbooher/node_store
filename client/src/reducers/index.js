import { combineReducers } from 'redux'
import authReducer from './authReducer'
import productReducer from './productReducer'
import cartReducer from './cartReducer'
import { reducer as reduxForm } from 'redux-form'


export default combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
  form: reduxForm,
})