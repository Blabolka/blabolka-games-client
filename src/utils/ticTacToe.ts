import {
    CellProps,
    CellFullData,
    InitialStateType,
    TicTacToeGridSize,
    TicTacToeGridSizeKeysEnum,
} from '@entityTypes/ticTacToe'

export const getTicTacToeInitialState = (): InitialStateType => {
    return {
        player: null,
        ticTacToeGrid: [],
        valuesInRowToFinish: 3,
        isGridDisabled: true,
        restartGame: { isOpen: false, isButtonClicked: true, message: '' },
    }
}

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

export const getValuesInRowToFinishByGridSizeKey = (gridSize: TicTacToeGridSizeKeysEnum): number => {
    switch (gridSize) {
        case TicTacToeGridSizeKeysEnum.THREE_BY_THREE:
            return 3
        case TicTacToeGridSizeKeysEnum.FIVE_BY_FIVE:
            return 4
        case TicTacToeGridSizeKeysEnum.SEVEN_BY_SEVEN:
            return 4
        default:
            return 3
    }
}

export const getGridSizeByGridSizeKey = (gridSize: TicTacToeGridSizeKeysEnum): TicTacToeGridSize => {
    switch (gridSize) {
        case TicTacToeGridSizeKeysEnum.THREE_BY_THREE:
            return { rowCount: 3, columnCount: 3 }
        case TicTacToeGridSizeKeysEnum.FIVE_BY_FIVE:
            return { rowCount: 5, columnCount: 5 }
        case TicTacToeGridSizeKeysEnum.SEVEN_BY_SEVEN:
            return { rowCount: 7, columnCount: 7 }
        default:
            return { rowCount: 3, columnCount: 3 }
    }
}
