import axios from "axios"

export const getShippingMethods = () => {
  return axios.get('/api/shipping_methods')
}

export const getShippingMethodForCheckout = () => {
  return axios.get('/api/shipping_methods/checkout')
}

export const getShippingMethod = (internal_name) => {
  return axios.get(`/api/shipping_methods/${internal_name}`)
}

export const updateShippingMethod = (shipping_method) => {
  const data = { shipping_method }
  return axios.put(`/api/shipping_method/update`, data)
}
