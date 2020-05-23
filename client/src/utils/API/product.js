import axios from "axios";

// find product by path name
export const getProductInfo = (path_name) => {
  return axios.get('/api/product/by_path_name/' + path_name)
}

// find product by path name
export const getProductbyId = (id) => {
  return axios.get('/api/product/' + id)
}

export const allInStockProducts = () => {
  return axios.get('/api/products/all/instock')
}

export const paginatedProducts = (last_product_id, direction) => {
  return axios.get('/api/products/all/' + last_product_id + "/" + direction)
}

export const createProduct = (new_product) => {
  const data = { new_product }
  return axios.post('/api/product/create', data)
}

export const updateProduct = (product) => {
  const data = { product }
  return axios.put(`/api/product/update`, data)
}

export const lastProduct = () => {
  return axios.get(`/api/products/last_product`)
}
