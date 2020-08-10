import { ZERO_INVETORY } from './types'
import axios from 'axios'


export const zeroInventorySettingCheck = () => async dispatch => {
  const { data } = await axios.get('/api/product_hiding/setting')

  dispatch({ type: ZERO_INVETORY, payload: data.value })
}