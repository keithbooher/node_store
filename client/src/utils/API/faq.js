import axios from "axios"

export const getFAQID =  (_id) => {
  return axios.get(`/api/faq/${_id}`)
}

export const getAllFAQs =  (_id) => {
  return axios.get(`/api/faqs`)
}

export const updateFAQ = (faq) => {
  const data = { faq }
  return axios.put('/api/faq/update', data) 
}

export const createFAQ = (faq) => {
  const data = { faq }
  return axios.post('/api/faq/create', data) 
}