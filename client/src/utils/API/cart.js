import axios from "axios";

export const getCurrentCart =  (user_id) => {
  return axios.get(`/api/cart/${user_id}`)
}

export const updateCart = (cart) => {
  const data = { cart }
  return axios.put('/api/cart/update/' + cart.id, data) 
}
