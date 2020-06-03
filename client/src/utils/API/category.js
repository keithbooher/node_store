import axios from "axios";


export const  getCategoryProducts = (path_name) => {
    return axios.get('/api/category/products/' + path_name)
}

export const getCategoryData = (path_name) => {
    return axios.get('/api/category/' + path_name)
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
    console.log(category)
    const data = { category }
    return axios.put('/api/category/update', data)
}


