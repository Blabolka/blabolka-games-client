import { TicTacToeTypes } from '../types'
import { TicTacToePlayer } from '@entityTypes/ticTacToePlayer'
import { CellFullData, RestartGame, InitialStateType } from '@entityTypes/ticTacToe'

export const setTicTacToe = (ticTacToeData: InitialStateType) => ({
    type: TicTacToeTypes.SET_TIC_TAC_TOE,
    payload: ticTacToeData,
})

export const setTicTacToePlayer = (player: TicTacToePlayer | null) => ({
    type: TicTacToeTypes.SET_PLAYER,
    payload: player,
})

export const setTicTacToeGrid = (ticTacToeGrid: CellFullData[][]) => ({
    type: TicTacToeTypes.SET_TIC_TAC_TOE_GRID,
    payload: ticTacToeGrid,
})

export const setTicTacToeCell = (ticTacToeCellData: CellFullData) => ({
    type: TicTacToeTypes.SET_TIC_TAC_TOE_CELL,
    payload: ticTacToeCellData,
})

export const setValuesInRowToFinish = (value: number) => ({
    type: TicTacToeTypes.SET_TIC_TAC_TOE_VALUES_IN_ROW_TO_FINISH,
    payload: value,
})

export const setIsGridDisabled = (state: boolean) => ({
    type: TicTacToeTypes.SET_IS_GRID_DISABLED,
    payload: state,
})

export const setRestartGame = (state: RestartGame) => ({
    type: TicTacToeTypes.SET_IS_RESTART_BUTTON_HIDE,
    payload: state,
})
