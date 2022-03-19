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
