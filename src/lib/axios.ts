import basicAxios from 'axios'

const serverBaseUrl: string = process.env.SERVER_BASE_URL || ''

const axios = serverBaseUrl ? basicAxios.create({ baseURL: serverBaseUrl }) : basicAxios

export default axios
