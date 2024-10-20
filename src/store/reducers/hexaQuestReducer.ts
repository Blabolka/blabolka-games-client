import { HexaQuestTypes } from '../types'
import { getHexaQuestInitialState, getInitialPlayerMoveState } from '@utils/hexaQuest'

const initialState = getHexaQuestInitialState()

const ticTacToeReducer = (state = initialState, action) => {
    switch (action.type) {
        case HexaQuestTypes.UPDATE_PLAYERS_GAME_STATE:
            return { ...state, playersGameState: { ...state.playersGameState, ...action.payload } }
        case HexaQuestTypes.UPDATE_PLAYER_MOVE_STATE:
            return { ...state, playerMoveState: { ...state.playerMoveState, ...action.payload } }
        case HexaQuestTypes.RESET_PLAYER_MOVE_STATE:
            return { ...state, playerMoveState: getInitialPlayerMoveState() }
        default:
            return state
    }
}

export default ticTacToeReducer
