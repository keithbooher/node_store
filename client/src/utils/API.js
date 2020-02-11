import axios from "axios";

export default {
  getProductInfo: function (path_name) {
    console.log(path_name)
    return axios.get('/api/product/' + path_name);
  },
  getCategoryProducts: function (path_name) {
    console.log(path_name)
    return axios.get('/api/category/products/' + path_name);
  }
}