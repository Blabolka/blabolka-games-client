import { TicTacToePlayer } from '@entityTypes/ticTacToePlayer'

export enum CellValuesEnum {
    X = 'X',
    O = 'O',
}

type CellPosition = {
    rowIndex: number
    columnIndex: number
}

export type CellProps = {
    isClicked: boolean
    value: CellValuesEnum | null
}

export type CellFullData = {
    cellPosition: CellPosition
    cellData: CellProps
}

export type RestartGame = {
    isOpen: boolean
    isButtonClicked: boolean
    message: string
}

export enum TicTacToeGridSizeKeysEnum {
    THREE_BY_THREE = '3x3',
    FIVE_BY_FIVE = '5x5',
    SEVEN_BY_SEVEN = '7x7',
}

export type TicTacToeGridSize = {
    rowCount: number
    columnCount: number
}

export type InitialStateType = {
    player: TicTacToePlayer | null
    ticTacToeGrid: CellFullData[][]
    valuesInRowToFinish: number
    isGridDisabled: boolean
    restartGame: RestartGame
}
