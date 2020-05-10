import axios from "axios";


export const getCurrentUser = () => {
  return axios.get('/api/current_user')
}

export const getUsers = (last_user_id, direction) => {
  return axios.get(`/api/users/${last_user_id}/${direction}`)
}

export const getUser = (id) => {
  return axios.get(`/api/users/${id}`)
}
