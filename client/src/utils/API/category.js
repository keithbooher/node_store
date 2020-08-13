import axios from "axios"
import { ERROR } from '../../actions/types'

export const createCategory = (category) => async dispatch => {
    const data = { category }
    let req = await axios.post('/api/category/create', data).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: category}
    }
}

export const updateCategory = (category) => async dispatch => {
    const data = { category }
    let req = await axios.put('/api/category/update', data).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: category}
    }
}

export const deleteCategory = (category) => async dispatch => {
    const data = { category }
    let req = await axios.put('/api/category/delete', data).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: category}
    }
}

////////////////////////////////////////////////////////////

export const  getCategoryProducts = (path_name) => async dispatch => {
    let req = await axios.get('/api/category/products/' + path_name).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: null}
    }
}

////////////////////////////////////////////////////////////

export const findCategory = (id) => async dispatch => {
    let req = await axios.get(`/api/category/${id}`).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: null}
    }
}

export const getAllCategories = () => async dispatch => {
    let req = await axios.get('/api/categories').catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: []}
    }
}

export const getTopCategories = () => async dispatch => {
    let req = await axios.get('/api/categories/top').catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: []}
    }
}


export const getSidebarCategories = () => async dispatch => {
    let req = await axios.get('/api/categories/sidebar').catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: []}
    }
}



