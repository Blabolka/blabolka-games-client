import { TicTacToeTypes } from '../types'
import { getTicTacToeArray } from '@utils/ticTacToe'
import { TicTacToePlayer } from '@entityTypes/ticTacToePlayer'
import { CellFullData, RestartGame } from '@entityTypes/ticTacToe'

type InitialStateType = {
    player: TicTacToePlayer | null
    ticTacToeGrid: CellFullData[][]
    valuesInRowToFinish: number
    isGridDisabled: boolean
    restartGame: RestartGame
}

const initialState: InitialStateType = {
    player: null,
    ticTacToeGrid: getTicTacToeArray(3, 3),
    valuesInRowToFinish: 3,
    isGridDisabled: true,
    restartGame: { isOpen: false, isButtonClicked: true, message: '' },
}

const ticTacToeReducer = (state = initialState, action) => {
    switch (action.type) {
        case TicTacToeTypes.SET_PLAYER: {
            return { ...state, player: action.payload }
        }
        case TicTacToeTypes.SET_TIC_TAC_TOE_GRID: {
            return { ...state, ticTacToeGrid: action.payload }
        }
        case TicTacToeTypes.SET_TIC_TAC_TOE_CELL: {
            const { cellPosition } = action.payload
            const { rowIndex, columnIndex } = cellPosition
            state.ticTacToeGrid = state.ticTacToeGrid.map((row, rowCurrentIndex) => {
                return row.map((cell, columnCurrentIndex) => {
                    return rowCurrentIndex === rowIndex && columnCurrentIndex === columnIndex ? action.payload : cell
                })
            })

            return { ...state }
        }
        case TicTacToeTypes.SET_IS_GRID_DISABLED: {
            return { ...state, isGridDisabled: action.payload }
        }
        case TicTacToeTypes.SET_IS_RESTART_BUTTON_HIDE: {
            return { ...state, restartGame: action.payload }
        }
        default:
            return state
    }
}

export default ticTacToeReducer
