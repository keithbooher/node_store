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

export const logout = (id) => {
  return axios.get(`/api/logout`)
}

export const lastUser = () => {
  return axios.get('/api/users/last_user') 
}

export const updateUser = (user) => {
  const data = { user }
  return axios.put('/api/update/user', data) 
}

export const getUserByEmail = (email) => {
  const data = { email }
  return axios.post('/api/user/email', data)
}