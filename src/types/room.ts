import { TicTacToeGridSizeKeysEnum } from '@entityTypes/ticTacToe'

// SERVER RESPONSE TYPES
export type RoomInfoWithParticipants = {
    roomId: string
    roomType: RoomTypesEnum
    roomInfo: TicTacToeRoomParams
    numberOfParticipants: number
    isPrivate: boolean
}

export type RoomInfo = {
    roomId: string
    roomType: RoomTypesEnum
    roomInfo: TicTacToeRoomParams
    isPrivate: boolean
}

// CLIENT TYPES
export type CreateRoomInfo = {
    roomType: RoomTypesEnum
    roomInfo: TicTacToeRoomParams
    isPrivate: boolean
    password?: string
}

// Helpers
export type TicTacToeRoomParams = {
    gridSize: TicTacToeGridSizeKeysEnum
    valuesInRowToFinish: number
}

export enum RoomTypesEnum {
    TIC_TAC_TOE = 'tic-tac-toe',
}
