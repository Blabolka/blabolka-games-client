import basicAxios, { AxiosResponse } from 'axios'

import { RoomBaseInfo, RoomFullInfo } from '@entityTypes/room'

const serverBaseUrl: string = process.env.SERVER_BASE_URL || ''

const axios = serverBaseUrl
    ? basicAxios.create({
          baseURL: serverBaseUrl,
      })
    : basicAxios

export const getRoomById: (roomId: string) => Promise<AxiosResponse<RoomFullInfo>> = async (roomId: string) => {
    return axios.get(`/room/${roomId}`)
}

export const createRoom: (roomInfo: RoomBaseInfo) => Promise<AxiosResponse<RoomFullInfo>> = async (
    roomInfo: RoomBaseInfo,
) => {
    return axios.post('/room', { ...roomInfo })
}
