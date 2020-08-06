import axios from "axios";

// find product by path name
export const getProductByPathName = (path_name) => {
  return axios.get('/api/product/by_path_name/' + path_name)
}

// find product by path name
export const getProductbyId = (id) => {
  return axios.get('/api/product/' + id)
}

// find product by path name
export const searchProduct = (term) => {
  return axios.post('/api/product/search', { term } )
}

// find product by path name
export const getProductbyName = (name) => {
  return axios.get('/api/product/name/' + name)
}

export const allInStockProducts = () => {
  return axios.get('/api/products/all/instock')
}

export const homeProducts = () => {
  return axios.get('/api/products/home_promotion')
}

export const paginatedProducts = (last_product_id, direction, category) => {
  return axios.get('/api/products/all/' + last_product_id + "/" + direction + "/" + category)
}

export const createProduct = (new_product) => {
  const data = { new_product }
  return axios.post('/api/product/create', data)
}

export const updateProduct = (product) => {
  const data = { product }
  return axios.put(`/api/product/update`, data)
}

export const lastProductByCategory = (category) => {
  return axios.post(`/api/products/last_product/by_category`, { category })
}

export const lastProduct = () => {
  return axios.get(`/api/products/last_product`)
}

export const checkInventory = (line_items) => {
  const data = {
    line_items
  }
  return axios.post(`/api/products/inventory_check`, data)
}
