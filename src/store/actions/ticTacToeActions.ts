import { TicTacToeTypes } from '../types'
import { TicTacToePlayer } from '@entityTypes/ticTacToePlayer'
import { CellFullData, RestartGame } from '@entityTypes/ticTacToe'

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

export const setIsGridDisabled = (state: boolean) => ({
    type: TicTacToeTypes.SET_IS_GRID_DISABLED,
    payload: state,
})

export const setRestartGame = (state: RestartGame) => ({
    type: TicTacToeTypes.SET_IS_RESTART_BUTTON_HIDE,
    payload: state,
})
