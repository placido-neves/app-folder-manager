import axios from 'axios'

const api = axios.create({
    baseURL:'http://192.168.15.19:8000'
})

export default api