import { HexaQuestTypes } from '../types'

export const updatePlayersGameState = (data) => ({
    type: HexaQuestTypes.UPDATE_PLAYERS_GAME_STATE,
    payload: data,
})

export const updatePlayerMoveState = (data) => ({
    type: HexaQuestTypes.UPDATE_PLAYER_MOVE_STATE,
    payload: data,
})

export const resetPlayerMoveState = () => ({
    type: HexaQuestTypes.RESET_PLAYER_MOVE_STATE,
})
