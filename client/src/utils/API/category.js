import axios from "axios";


export const  getCategoryProducts = (path_name) => {
    return axios.get('/api/category/products/' + path_name)
}

export const getCategoryData = (path_name) => {
    return axios.get('/api/category/' + path_name);
}
