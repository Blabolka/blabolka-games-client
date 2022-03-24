import { TicTacToeTypes } from '../types'
import { getTicTacToeInitialState } from '@utils/ticTacToe'
import { InitialStateType } from '@entityTypes/ticTacToe'

const initialState: InitialStateType = getTicTacToeInitialState()

const ticTacToeReducer = (state = initialState, action) => {
    switch (action.type) {
        case TicTacToeTypes.SET_TIC_TAC_TOE: {
            return { ...action.payload }
        }
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
        case TicTacToeTypes.SET_TIC_TAC_TOE_VALUES_IN_ROW_TO_FINISH: {
            return { ...state, valuesInRowToFinish: action.payload }
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
