import axios from "axios"
import { ERROR } from '../../actions/types'
import Bugsnag from '@bugsnag/js'

// find product by path name
export const getProductByPathName = (path_name) => async dispatch => {
  let req = await axios.get('/api/product/by_path_name/' + path_name).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}

// find product by path name
export const getProductbyId = (id) => async dispatch => {
  let req = await axios.get('/api/product/' + id).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}

// find product by path name
export const searchProduct = (term) => async dispatch => {
  let req = await axios.post('/api/product/search', { term } ).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: term}
  }
}

// find product by path name
export const getProductbyName = (name) => async dispatch => {
  let req = await axios.get('/api/product/name/' + name).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}

export const homeProducts = () => async dispatch => {
  let req = await axios.get('/api/products/home_promotion').catch(error => {
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

export const paginatedProducts = (last_product_id, direction, category) => async dispatch => {
  let req = await axios.get('/api/products/all/' + last_product_id + "/" + direction + "/" + category).catch(error => {
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

export const createProduct = (new_product) => async dispatch => {
  const data = { new_product }
  let req = await axios.post('/api/product/create', data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}

export const updateProduct = (product) => async dispatch => {
  const data = { product }
  let req = await axios.put(`/api/product/update`, data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}

export const updateManyProducts = (products) => async dispatch => {
  const data = { products }
  let req = await axios.put(`/api/product/update/many`, data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}

export const lastProductByCategory = (category) => async dispatch => {
  let req = await axios.post(`/api/products/last_product/by_category`, { category }).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}

export const lastProduct = () => async dispatch => {
  let req = await axios.get(`/api/products/last_product`).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}

export const getProductAverageRating = (_product_id) => async dispatch => {
  let req = await axios.get(`/api/product/average_rating/${_product_id}`).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}

export const getAllProducts = () => async dispatch => {
  let req = await axios.get(`/api/all/products`).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}

export const checkInventory = (line_items) => async dispatch => {
  const data = {
    line_items
  }
  let req = await axios.post(`/api/products/inventory_check`, data).catch(error => {
    dispatch({ type: ERROR, payload: error.response })
    Bugsnag.notify(error)
    return error.response
  })
  if (req.status === 200) {
      return req
  } else {
      return {data: "error"}
  }
}
