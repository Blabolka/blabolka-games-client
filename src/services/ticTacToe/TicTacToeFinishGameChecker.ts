import { CellFullData } from '@entityTypes/ticTacToe'

export class TicTacToeFinishGameChecker {
    private readonly ticTacToe: CellFullData[][]
    private readonly lastClickedCell: CellFullData
    private readonly valuesInRowToFinish: number

    constructor(ticTacToe: CellFullData[][], lastClickedCell: CellFullData, valuesInRowToFinish) {
        this.ticTacToe = ticTacToe
        this.lastClickedCell = lastClickedCell
        this.valuesInRowToFinish = valuesInRowToFinish
    }

    public checkFinishGame() {
        return (
            this.checkRow() ||
            this.checkColumn() ||
            this.checkDiagonal() ||
            this.checkOppositeDiagonal() ||
            this.checkDraw()
        )
    }

    private checkTheSameCellValueInRow(cells: CellFullData[]) {
        return cells.some((cell, index, allCells) => {
            // if possible to slice array
            if (index + this.valuesInRowToFinish <= allCells.length) {
                const possibleFinishGameCells = cells.slice(index, index + this.valuesInRowToFinish)

                return possibleFinishGameCells.every((cell) => {
                    return cell.cellData.value === this.lastClickedCell.cellData.value
                })
            }

            return false
        })
    }

    private checkRow() {
        const rowOfClickedCell = this.ticTacToe.find((_, rowIndex) => {
            return this.lastClickedCell.cellPosition.rowIndex === rowIndex
        })

        return rowOfClickedCell ? this.checkTheSameCellValueInRow(rowOfClickedCell) : false
    }

    private checkColumn() {
        const columnOfClickedCell = this.ticTacToe.map((row) => {
            const columnCell = row.find((_, columnIndex) => {
                return this.lastClickedCell.cellPosition.columnIndex === columnIndex
            })

            return columnCell || []
        })

        return columnOfClickedCell ? this.checkTheSameCellValueInRow(columnOfClickedCell.flat(1)) : false
    }

    private checkDiagonal() {
        const clickedCellMinimumIndex = Math.min(
            this.lastClickedCell.cellPosition.rowIndex,
            this.lastClickedCell.cellPosition.columnIndex,
        )

        let diagonalStartPositionRow = this.lastClickedCell.cellPosition.rowIndex - clickedCellMinimumIndex
        let diagonalStartPositionColumn = this.lastClickedCell.cellPosition.columnIndex - clickedCellMinimumIndex

        const ticTacToeRowCount = this.ticTacToe.length
        const ticTacToeColumnCount = this.ticTacToe[0].length

        const diagonalOfClickedCell: CellFullData[] = []
        while (diagonalStartPositionRow < ticTacToeRowCount && diagonalStartPositionColumn < ticTacToeColumnCount) {
            diagonalOfClickedCell.push(this.ticTacToe[diagonalStartPositionRow][diagonalStartPositionColumn])

            diagonalStartPositionRow += 1
            diagonalStartPositionColumn += 1
        }

        return diagonalOfClickedCell ? this.checkTheSameCellValueInRow(diagonalOfClickedCell) : false
    }

    private checkOppositeDiagonal() {
        const ticTacToeRowCount = this.ticTacToe.length
        const ticTacToeColumnCount = this.ticTacToe[0].length

        const clickedCellOffsetIndex = Math.min(
            this.lastClickedCell.cellPosition.rowIndex,
            ticTacToeColumnCount - 1 - this.lastClickedCell.cellPosition.columnIndex,
        )

        let diagonalStartPositionRow = this.lastClickedCell.cellPosition.rowIndex - clickedCellOffsetIndex
        let diagonalStartPositionColumn = this.lastClickedCell.cellPosition.columnIndex + clickedCellOffsetIndex

        const diagonalOfClickedCell: CellFullData[] = []
        while (diagonalStartPositionRow < ticTacToeRowCount && diagonalStartPositionColumn >= 0) {
            diagonalOfClickedCell.push(this.ticTacToe[diagonalStartPositionRow][diagonalStartPositionColumn])

            diagonalStartPositionRow += 1
            diagonalStartPositionColumn -= 1
        }

        return diagonalOfClickedCell ? this.checkTheSameCellValueInRow(diagonalOfClickedCell) : false
    }

    private checkDraw() {
        return this.ticTacToe.every((row) => {
            return row.every((cell) => cell.cellData.isClicked)
        })
    }
}
