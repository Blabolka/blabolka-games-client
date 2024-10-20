import { GamePlayerMoveState, GamePlayersState, MoveType } from '@entityTypes/hexaQuest'

export type InitialStateType = {
    playerMoveState: GamePlayerMoveState
    playersGameState: GamePlayersState
}

export const getInitialPlayerMoveState = (): GamePlayerMoveState => ({
    moveType: MoveType.MOVE,
    path: [],
    availableHexesToMove: [],
})

export const getHexaQuestInitialState = (): InitialStateType => {
    return {
        playerMoveState: getInitialPlayerMoveState(),
        playersGameState: {
            players: [],
            currentPlayerCoordinates: undefined,
        },
    }
}
