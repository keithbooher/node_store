import axios from "axios";


export const getCurrentUser = () => {
  return axios.get('/api/current_user')
}
