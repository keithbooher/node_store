import axios from "axios";


export const createCategory = (category) => {
    const data = { category }
    return axios.post('/api/category/create', data)
}

export const updateCategory = (category) => {
    const data = { category }
    return axios.put('/api/category/update', data)
}

////////////////////////////////////////////////////////////

export const  getCategoryProducts = (path_name) => {
    console.log(path_name)
    return axios.get('/api/category/products/' + path_name)
}

////////////////////////////////////////////////////////////

export const getAllCategories = () => {
    return axios.get('/api/categories')
}

export const getTopCategories = () => {
    return axios.get('/api/categories/top')
}


export const getSidebarCategories = () => {
    return axios.get('/api/categories/sidebar')
}



