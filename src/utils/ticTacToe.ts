import { CellProps, CellFullData, TicTacToeGridSizesEnum } from '@entityTypes/ticTacToe'

export const getTicTacToeArray = (rowCount, columnCount): CellFullData[][] => {
    const basicCellInfoArray: CellProps[][] = Array(rowCount).fill(
        Array(columnCount).fill({
            isClicked: false,
            value: null,
        }),
    )

    return basicCellInfoArray.map((row, rowIndex) => {
        return row.map((cell, columnIndex) => {
            return {
                cellPosition: { rowIndex, columnIndex },
                cellData: cell,
            }
        })
    })
}

export const getValuesInRowToFinishByGridSize = (gridSize: TicTacToeGridSizesEnum): number => {
    switch (gridSize) {
        case TicTacToeGridSizesEnum.THREE_BY_THREE:
            return 3
        case TicTacToeGridSizesEnum.FIVE_BY_FIVE:
            return 4
        case TicTacToeGridSizesEnum.SEVEN_BY_SEVEN:
            return 4
        default:
            return 3
    }
}
