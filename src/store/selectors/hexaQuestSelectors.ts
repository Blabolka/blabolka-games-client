import { RootState } from '@redux-store'

export const getPlayerMoveState = (state: RootState) => state.hexaQuest.playerMoveState
export const getPlayersGameState = (state: RootState) => state.hexaQuest.playersGameState
