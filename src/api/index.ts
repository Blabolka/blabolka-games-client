import basicAxios from 'axios'

import { RoomBaseInfo, RoomFullInfo } from '@entityTypes/room'

const serverBaseUrl: string = process.env.SERVER_BASE_URL || ''

const axios = serverBaseUrl
    ? basicAxios.create({
          baseURL: serverBaseUrl,
      })
    : basicAxios

export const createRoom: (roomInfo: RoomBaseInfo) => Promise<RoomFullInfo> = async (roomInfo: RoomBaseInfo) => {
    return axios.post('/room', { ...roomInfo })
}
