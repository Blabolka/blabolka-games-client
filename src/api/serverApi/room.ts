import axios from '@lib/axios'
import { AxiosResponse } from 'axios'
import { CreateRoomInfo, RoomInfo, RoomInfoWithParticipants } from '@entityTypes/room'

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
