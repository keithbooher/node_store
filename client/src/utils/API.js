import axios from "axios";

export default {
  getProductInfo: (path_name) => {
    return axios.get('/api/product/' + path_name)
  },
  allInStockProducts: () => {
    return axios.get('/api/products/all/instock')
  },
  getCategoryProducts: (path_name) => {
    return axios.get('/api/category/products/' + path_name)
  },
  getCategoryData: (path_name) => {
    return axios.get('/api/category/' + path_name);
  },
  createOrder: (order) => {
    const data = { order }
    return axios.post('/api/order/create', data)
  }
}
