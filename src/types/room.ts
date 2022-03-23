import { TicTacToeGridSizeKeysEnum } from '@entityTypes/ticTacToe'

export type RoomFullInfo = {
    _id?: string
    roomId: string
} & RoomBaseInfo

export type RoomBaseInfo = {
    roomType: RoomTypesEnum
    roomInfo: TicTacToeRoomParams
    isPrivate: boolean
    password?: string
}

type TicTacToeRoomParams = {
    gridSize: TicTacToeGridSizeKeysEnum
    valuesInRowToFinish: number
}

export enum RoomTypesEnum {
    TIC_TAC_TOE = 'tic-tac-toe',
}
