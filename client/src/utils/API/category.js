import axios from "axios";


export const  getCategoryProducts = (path_name) => {
    return axios.get('/api/category/products/' + path_name)
}

export const getCategoryByPathName = (path_name) => {
    return axios.get('/api/category/by_path_name/' + path_name)
}

export const getCategory = (id) => {
    return axios.get('/api/category/' + id)
}

export const getAllCategories = () => {
    return axios.get('/api/categories')
}

export const getTopCategories = () => {
    return axios.get('/api/categories/top')
}

export const createCategory = (category) => {
    const data = { category }
    return axios.post('/api/category/create', data)
}

export const updateCategory = (category) => {
    const data = { category }
    return axios.put('/api/category/update', data)
}


