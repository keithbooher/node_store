import { combineReducers } from 'redux'
import authReducer from './authReducer'
import cartReducer from './cartReducer'
import sidebarReducer from './sidebarReducer'
import enlargeReducer from './enlargeReducer'
import { reducer as reduxForm } from 'redux-form'


export default combineReducers({
  auth: authReducer,
  cart: cartReducer,
  form: reduxForm,
  sidebar: sidebarReducer,
  enlarge: enlargeReducer,
})