import React from 'react'

import HexagonField from './HexagonField/HexagonField'
import HexagonPlayer from './HexagonPlayer/HexagonPlayer'

import { GamePlayerMoveState, GamePlayersState, Hex, PlayerConfigItem, TeamType } from '@entityTypes/hexaQuest'

export type HexagonRendererProps = {
    hex: Hex
    currentPlayer?: PlayerConfigItem
    playerMoveState: GamePlayerMoveState
    playersGameState: GamePlayersState
}

export type HexagonRendererState = {
    hex: Hex
    player?: PlayerConfigItem
    isCurrentPlayer: boolean
    isEnemyPlayer: boolean
    isFriendPlayer: boolean
    isHexAccessibleByPlayer: boolean
}

const HexagonRenderer = ({ hex, currentPlayer, playerMoveState, playersGameState }: HexagonRendererProps) => {
    const player = playersGameState.players.find((player) => {
        return hex.q === player.coordinates.q && hex.r === player.coordinates.r
    })

    const rendererState: HexagonRendererState = {
        hex,
        player,
        isCurrentPlayer:
            player?.coordinates?.q === currentPlayer?.coordinates?.q &&
            player?.coordinates?.r === currentPlayer?.coordinates?.r,
        isEnemyPlayer: player?.config?.team === TeamType.ENEMY,
        isFriendPlayer: player?.config?.team === TeamType.FRIEND,
        isHexAccessibleByPlayer: playerMoveState.availableHexesToMove.some(
            (availableHex) => availableHex.q === hex.q && availableHex.r === hex.r,
        ),
    }

    return (
        <>
            <HexagonField rendererState={rendererState} />
            <HexagonPlayer rendererState={rendererState} />
        </>
    )
}

export default HexagonRenderer
