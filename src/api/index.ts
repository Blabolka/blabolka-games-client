import basicAxios, { AxiosResponse } from 'axios'
import { CreateRoomInfo, RoomInfo, RoomInfoWithParticipants } from '@entityTypes/room'

const serverBaseUrl: string = process.env.SERVER_BASE_URL || ''

const axios = serverBaseUrl ? basicAxios.create({ baseURL: serverBaseUrl }) : basicAxios

export const getRoomById: (roomId: string) => Promise<AxiosResponse<RoomInfoWithParticipants>> = async (
    roomId: string,
) => {
    return axios.get(`/room/${roomId}`)
}

export const createRoom: (roomInfo: CreateRoomInfo) => Promise<AxiosResponse<RoomInfo>> = async (
    roomInfo: CreateRoomInfo,
) => {
    return axios.post('/room', { ...roomInfo })
}

export const loginRoom: (roomId: string, password: string) => Promise<AxiosResponse<boolean>> = async (
    roomId: string,
    password: string,
) => {
    return axios.post(`/room/${roomId}/login`, { password })
}
