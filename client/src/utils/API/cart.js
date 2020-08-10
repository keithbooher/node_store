import axios from "axios";

export const getCurrentCart =  (user_id) => {
  return axios.get(`/api/current/cart/${user_id}`)
}

export const getCartByID =  (_id) => {
  return axios.get(`/api/cart/${_id}`)
}

export const updateCart = (cart) => {
  const data = { cart }
  return axios.put('/api/cart/update/' + cart.id, data) 
}

export const createCart = (cart) => {
  const data = { cart }
  return axios.post('/api/cart/create', data) 
}

export const paginatedCarts = (direction_reference_id, direction, status, search_term) => {
  return axios.get(`/api/carts/${direction_reference_id}/${direction}/${status}/${search_term}`) 
}

export const lastCart = (status, search_term) => {
  return axios.get(`/api/carts/last_order/${status}/${search_term}`) 
}
