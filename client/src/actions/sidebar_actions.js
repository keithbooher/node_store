import { SIDEBAR } from './types'

export const sidebarBoolean = (boolean) => dispatch => {
  dispatch({ type: SIDEBAR, payload: boolean })
}