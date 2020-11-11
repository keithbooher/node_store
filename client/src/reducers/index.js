import { combineReducers } from 'redux'
import authReducer from './authReducer'
import cartReducer from './cartReducer'
import sidebarReducer from './sidebarReducer'
import enlargeReducer from './enlargeReducer'
import zeroInventoryReducer from './zeroInventorySettingReducer'
import taxSettingReducer from './taxSettingReducer'
import showCartReducer from './showCartReducer'
import showHeaderReducer from './showHeaderReducer'
import errorReducer from './errorReducer'
import mobileReducer from './mobileReducer'
import { reducer as reduxForm } from 'redux-form'


export default combineReducers({
  auth: authReducer,
  cart: cartReducer,
  form: reduxForm,
  sidebar: sidebarReducer,
  enlarge: enlargeReducer,
  zeroInventory: zeroInventoryReducer,
  noTaxSetting: taxSettingReducer,
  showCart: showCartReducer,
  showHeader: showHeaderReducer,
  error: errorReducer,
  mobile: mobileReducer,
})