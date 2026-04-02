import axios from 'axios'

const axiosClient = axios.create({
  baseURL: '/api', // dùng rewrite
  withCredentials: true,
  timeout: 10000,
  paramsSerializer: {
    indexes: null,
  },
})

axiosClient.interceptors.response.use(
  (res) => res.data,
  (error) => {
    return Promise.reject(error.response?.data || error)
  }
)

export default axiosClient
