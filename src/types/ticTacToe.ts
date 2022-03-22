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

export enum TicTacToeGridSizesEnum {
    THREE_BY_THREE = '3x3',
    FIVE_BY_FIVE = '5x5',
    SEVEN_BY_SEVEN = '7x7',
}
