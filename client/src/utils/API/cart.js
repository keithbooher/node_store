import axios from "axios";

export const getCurrentCart =  (user) => {
  return axios.get('/api/cart/' + user._id)
}

export const updateCart = (cart) => {
  const data = { cart }
  return axios.put('/api/cart/update/' + cart.id, data) 
}
