import axios from "axios"
import { ERROR } from '../../actions/types'

export const submitReview = (review) => async dispatch => {
    const data = { review }
    let req = await axios.post('/api/review/create', data).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: review}
    }
}

export const updateReview = (review) => async dispatch => {
    const data = { review }
    let req = await axios.put('/api/review/update', data).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: review}
    }
}

export const checkIfReviewExists = (line_item_id) => async dispatch => {
    let req = await axios.get(`/api/review/check_exists/${line_item_id}`).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: "error"}
    }
}

export const getUsersReviews = (user_id, last_review_id, direction) => async dispatch => {
    let req = await axios.get(`/api/review/user/${user_id}/${last_review_id}/${direction}`).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: []}
    }
}

export const lastUserReview = (_user_id) => async dispatch => {
    let req = await axios.get('/api/review/user/last_review/' + _user_id).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: "error"}
    }
}

export const getAllReviews = (last_review_id, direction, approval) => async dispatch => {
    let req = await axios.get('/api/reviews/' + last_review_id + "/" + direction + "/" + approval).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: []}
    }
}

export const getProductsReviews = (_product_id, direction, last_review_id) => async dispatch => {
    let req = await axios.get('/api/reviews/product/' + _product_id + "/" + direction + "/" + last_review_id).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: []}
    }
}

export const lastReview = (_product_id) => async dispatch => {
    let req = await axios.get('/api/review/product/last_review/' + _product_id).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: "error"}
    }
}


