import axios from "axios";

export const createOrder = (order) => {
    const data = { order }
    return axios.post('/api/order/create', data)
}

export const getUsersOrders = (user_id, last_order_id, direction) => {
    return axios.get('/api/user/orders/' + user_id + "/" + last_order_id + "/" + direction) 
}

export const getOrder = (order_id) => {
    return axios.get(`/api/order/${order_id}`) 
}

export const paginatedOrders = (last_order_id, direction, status) => {
    return axios.get('/api/orders/' + last_order_id + "/" + direction + "/" + status) 
}

export const lastOrder = () => {
    return axios.get('/api/orders/last_order') 
}
