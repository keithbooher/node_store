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
  },
  getCurrentCart: (user) => {
    return axios.get('/api/cart/' + user._id)
  },
  getCurrentUser: () => {
    return axios.get('/api/current_user')
  },
  updateCart: (cart) => {
    const data = { cart }
    return axios.put('/api/cart/update/' + cart.id, data) 
  },
  getUsersOrders: (user_id, last_order_id) => {
    console.log(last_order_id)
    const data = { last_order_id }
    return axios.get('/api/user/orders/' + user_id, data) 
  }
}
