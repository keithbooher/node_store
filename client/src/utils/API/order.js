import axios from "axios";

export const createOrder = (order) => {
    const data = { order }
    return axios.post('/api/order/create', data)
}

export const updateOrder = (order) => {
    const data = { order }
    return axios.put('/api/order/update', data)
}

export const getUsersOrders = (user_id, last_order_id, direction) => {
    return axios.get('/api/user/orders/' + user_id + "/" + last_order_id + "/" + direction) 
}

export const getOrder = (order_id) => {
    return axios.get(`/api/order/${order_id}`) 
}

export const paginatedOrders = (last_order_id, direction, status, search_term) => {
    return axios.get('/api/orders/' + last_order_id + "/" + direction + "/" + status + "/" + search_term) 
}

export const lastOrder = (user_id) => {
    return axios.get('/api/orders/last_order/' + user_id) 
}

export const lastOrderAdmin = (status, search_term) => {
    return axios.get('/api/orders/admin/last_order/' + status + "/" + search_term) 
}

export const searchOrders = (search_term) => {
    return axios.post('/api/orders/search', {search_term}) 
}

