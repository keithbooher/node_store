import axios from "axios"

export const orderConfirmation =  (recipient, orderNumber) => {
  let data = { recipient, orderNumber }
  console.log(data)
  return axios.post(`/api/email/order_confirmation`, data)
}
