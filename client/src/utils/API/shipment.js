import axios from "axios"

export const createShipment = (shipment) => {
  const data = { shipment }
  return axios.post('/api/shipment/create', data)
}

export const updateShipment = (shipment) => {
  const data = { shipment }
  return axios.put('/api/shipment/update', data)
}