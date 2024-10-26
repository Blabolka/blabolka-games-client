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

export const parseHexStringCoordinates = (hexStringCoordinates: string) => {
    const [q, r, s] = hexStringCoordinates.slice(1, -1).split(',')
    return { q: Number(q), r: Number(r), s: Number(s) }
}
