import axios from "axios"

export const updateStoreSetting = (setting) => {
  let data = {
    setting
  }
  return axios.put('/api/setting/update', data)
}

export const getAllStoreSettings = () => {
  return axios.get('/api/all/settings')
}

export const homeBanner = (device) => {
  return axios.get(`/api/setting/home_banner/${device}`)
}
