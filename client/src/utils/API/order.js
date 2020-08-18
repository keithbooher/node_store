import axios from "axios"
import { ERROR } from '../../actions/types'
import Bugsnag from '@bugsnag/js'

export const createOrder = (order) => async dispatch => {
    const data = { order }
    let req = await axios.post('/api/order/create', data).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        Bugsnag.notify(error)        
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: order}
    }
}

export const updateOrder = (order) => async dispatch => {
    const data = { order }
    let req = await axios.put('/api/order/update', data).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        Bugsnag.notify(error)        
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: order}
    }
}

export const getUsersOrders = (user_id, last_order_id, direction) => async dispatch => {
    let req = await axios.get('/api/user/orders/' + user_id + "/" + last_order_id + "/" + direction).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        Bugsnag.notify(error)        
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: []}
    }
}

export const getOrder = (order_id) => async dispatch => {
    let req = await axios.get(`/api/order/${order_id}`).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        Bugsnag.notify(error)        
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: null}
    }
}

export const paginatedOrders = (last_order_id, direction, status, search_term) => async dispatch => {
    let req = await axios.get('/api/orders/' + last_order_id + "/" + direction + "/" + status + "/" + search_term).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        Bugsnag.notify(error)        
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: []}
    }
}

export const lastOrder = (user_id) => async dispatch => {
    let req = await axios.get('/api/orders/last_order/' + user_id).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        Bugsnag.notify(error)        
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: null}
    }
}

export const lastOrderAdmin = (status, search_term) => async dispatch => {
    let req = await axios.get('/api/orders/admin/last_order/' + status + "/" + search_term).catch(error => {
        dispatch({ type: ERROR, payload: error.response })
        Bugsnag.notify(error)        
        return error.response
    })
    if (req.status === 200) {
        return req
    } else {
        return {data: null}
    }
}

