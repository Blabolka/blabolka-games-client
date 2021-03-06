import { CellValuesEnum } from '@entityTypes/ticTacToe'

export type TicTacToePlayer = {
    id: string
    value: CellValuesEnum
    isTurnToStartGame: boolean
}
