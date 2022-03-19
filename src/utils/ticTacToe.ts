import { CellProps, CellFullData } from '@entityTypes/ticTacToe'

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
