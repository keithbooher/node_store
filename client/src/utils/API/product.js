import axios from "axios";


export const getProductInfo = (path_name) => {
  return axios.get('/api/product/' + path_name)
}

export const allInStockProducts = () => {
  return axios.get('/api/products/all/instock')
}
