import { ZERO_INVETORY, TAX } from './types'
import axios from 'axios'


export const zeroInventorySettingCheck = () => async dispatch => {
  const { data } = await axios.get('/api/product_hiding/setting')

  dispatch({ type: ZERO_INVETORY, payload: data.value })
}

export const taxSettingCheck = () => async dispatch => {
  const { data } = await axios.get('/api/tax/setting')

  dispatch({ type: TAX, payload: data.value.boolean })
}