import { RootState } from '@redux-store'

export const getTicTacToePlayer = (state: RootState) => state.ticTacToe.player
export const getTicTacToeGrid = (state: RootState) => state.ticTacToe.ticTacToeGrid
export const getTicTacToeRestart = (state: RootState) => state.ticTacToe.restartGame
export const getTicTacToeIsGridDisabled = (state: RootState) => state.ticTacToe.isGridDisabled
export const getTicTacToeRestartIsOpen = (state: RootState) => state.ticTacToe.restartGame.isOpen
export const getTicTacToeValuesInRowToFinish = (state: RootState) => state.ticTacToe.valuesInRowToFinish
