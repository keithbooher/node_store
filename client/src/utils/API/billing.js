
import axios from "axios"

export const handleToken = (token) => {
  return axios.post('/api/stripe', token)
}

export const handleRefund = (charge) => {
  return axios.post('/api/stripe/refund', {charge})
}