import axios from "axios"

export const createShipment = (shipment) => {
  const data = { shipment }
  return axios.post('/api/shipment/create', data)
}