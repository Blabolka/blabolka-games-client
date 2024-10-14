import React, { useEffect, useMemo, useState } from 'react'

import Hexagon from '@components/Hexagon/Hexagon'
import HexagonPath from '@components/HexagonPath/HexagonPath'
import HexagonGrid from '@components/HexagonGrid/HexagonGrid'
import HexagonRenderer from './HexagonRenderer/HexagonRenderer'
import HexaQuestGUI from '@pages/HexaQuest/HexaQuestGUI/HexaQuestGUI'
import HexagonInfoTooltip from './HexagonInfoTooltip/HexagonInfoTooltip'

import { Grid } from 'honeycomb-grid'
import { GamePlayerMoveState, GamePlayersState, Hex, MoveType, PlayerConfigItem } from '@entityTypes/hexaQuest'
import {
    getPathToMove,
    getPathToAttack,
    sumPathMoveCost,
    getInitialGameConfig,
    getPlayerByCoordinates,
    getHexagonRendererState,
    getAvailableHexesToMove,
    getInitialPlayerMoveState,
    getAvailableHexesToAttack,
    getAttackConfigByPlayerAndType,
} from './hexaQuestHelpers'

import './HexaQuest.less'

const HexaQuest = () => {
    const [grid, setGrid] = useState<Grid<Hex>>()
    const [playerMoveState, setPlayerMoveState] = useState<GamePlayerMoveState>(getInitialPlayerMoveState())
    const [playersGameState, setPlayersGameState] = useState<GamePlayersState>({
        players: [],
        currentPlayerCoordinates: undefined,
    })

    const currentPlayer = useMemo(
        (): PlayerConfigItem | undefined =>
            playersGameState.currentPlayerCoordinates
                ? getPlayerByCoordinates(playersGameState.players, {
                      q: playersGameState.currentPlayerCoordinates?.q,
                      r: playersGameState.currentPlayerCoordinates?.r,
                  })
                : undefined,
        [playersGameState.players, playersGameState.currentPlayerCoordinates],
    )

    const onPlayerMove = (hex: Hex) => {
        if (!playerMoveState.path.length) return

        const newPlayerCoordinates = { q: hex.q, r: hex.r }
        const pathCost = sumPathMoveCost(playerMoveState.path)

        setPlayerMoveState(getInitialPlayerMoveState())
        setPlayersGameState({
            ...playersGameState,
            currentPlayerCoordinates: newPlayerCoordinates,
            players: playersGameState.players.map((player) =>
                player.coordinates.q === playersGameState.currentPlayerCoordinates?.q &&
                player.coordinates.r === playersGameState.currentPlayerCoordinates?.r
                    ? {
                          ...player,
                          coordinates: newPlayerCoordinates,
                          config: {
                              ...player.config,
                              remainingMoveCost: player.config.remainingMoveCost - pathCost,
                          },
                      }
                    : player,
            ),
        })
    }

    const onPlayerAttack = (hex: Hex) => {
        setPlayerMoveState(getInitialPlayerMoveState())
        setPlayersGameState({
            ...playersGameState,
            players: playersGameState.players.reduce<PlayerConfigItem[]>((memo, player) => {
                const isCurrentPlayer =
                    player.coordinates.q === playersGameState.currentPlayerCoordinates?.q &&
                    player.coordinates.r === playersGameState.currentPlayerCoordinates?.r
                const isAttackedPlayer = player.coordinates.q === hex.q && player.coordinates.r === hex.r

                if (isCurrentPlayer) {
                    memo.push({
                        ...player,
                        config: {
                            ...player.config,
                            remainingActions: player.config.remainingActions - 1,
                        },
                    })
                } else if (isAttackedPlayer) {
                    const attackConfig = getAttackConfigByPlayerAndType(
                        currentPlayer?.config.type,
                        playerMoveState.moveType,
                    )
                    const remainingHealthPoints = attackConfig
                        ? Math.max(0, player.config.remainingHealthPoints - attackConfig.damage)
                        : player.config.remainingHealthPoints

                    if (remainingHealthPoints) {
                        memo.push({
                            ...player,
                            config: {
                                ...player.config,
                                remainingHealthPoints,
                            },
                        })
                    }
                } else {
                    memo.push(player)
                }

                return memo
            }, []),
        })
    }

    const onHexagonClick = (hex: Hex) => {
        switch (playerMoveState.moveType) {
            case MoveType.MOVE:
                onPlayerMove(hex)
                break
            case MoveType.MELEE_ATTACK:
            case MoveType.RANGE_ATTACK:
                onPlayerAttack(hex)
                break
        }
    }

    const onPlayerAttackStart = (moveType: MoveType) => {
        setPlayerMoveState((state) => ({
            ...state,
            moveType,
        }))
    }

    const onPlayerMoveCancel = () => {
        setPlayerMoveState(getInitialPlayerMoveState())
    }

    const onPlayerFinishMove = () => {
        const currentPlayerIndex = playersGameState.players.findIndex((player) => {
            return (
                currentPlayer?.coordinates?.q === player.coordinates.q &&
                currentPlayer?.coordinates?.r === player.coordinates.r
            )
        })

        setPlayerMoveState(getInitialPlayerMoveState())
        setPlayersGameState({
            ...playersGameState,
            currentPlayerCoordinates: (playersGameState.players[currentPlayerIndex + 1] || playersGameState.players[0])
                .coordinates,
            players: playersGameState.players.map((player) =>
                player.coordinates.q === playersGameState.currentPlayerCoordinates?.q &&
                player.coordinates.r === playersGameState.currentPlayerCoordinates?.r
                    ? {
                          ...player,
                          config: {
                              ...player.config,
                              remainingActions: player.config.numberOfActionsPerTurn,
                              remainingMoveCost: player.config.numberOfMoveCostPerTurn,
                          },
                      }
                    : player,
            ),
        })
    }

    const onHexHover = (hex?: Hex) => {
        const updatePath = (path: Hex[]) => {
            setPlayerMoveState((state) => ({ ...state, path }))
        }

        if (!grid || !hex || !currentPlayer) {
            return updatePath([])
        }

        const isHexAccessibleByPlayer = playerMoveState.availableHexesToMove.some((availableHex) =>
            hex.equals(availableHex),
        )
        if (!isHexAccessibleByPlayer) {
            return updatePath([])
        }

        updatePath(
            playerMoveState.moveType === MoveType.MOVE
                ? getPathToMove(grid, currentPlayer, playersGameState.players, hex)
                : getPathToAttack(grid, currentPlayer, hex),
        )
    }

    useEffect(() => {
        const { grid: initialGrid, players } = getInitialGameConfig()

        setGrid(initialGrid)
        setPlayersGameState({ players, currentPlayerCoordinates: players[0].coordinates })
    }, [])

    useEffect(() => {
        if (!grid || !currentPlayer) return

        setPlayerMoveState((state) => ({
            ...state,
            availableHexesToMove:
                playerMoveState.moveType === MoveType.MOVE
                    ? getAvailableHexesToMove(grid, playersGameState.players, currentPlayer)
                    : getAvailableHexesToAttack(grid, currentPlayer, playerMoveState.moveType),
        }))
    }, [currentPlayer, playerMoveState.moveType, playersGameState.players])

    return (
        <div className="center-page hexa-quest__wrapper" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '24px', right: '8px' }}>
                <HexaQuestGUI
                    currentPlayer={currentPlayer}
                    playerMoveState={playerMoveState}
                    playersGameState={playersGameState}
                    onPlayerAttackStart={onPlayerAttackStart}
                    onPlayerMoveCancel={onPlayerMoveCancel}
                    onPlayerFinishMove={onPlayerFinishMove}
                />
            </div>
            <div className="column align-center" style={{ width: '100%', overflow: 'auto' }}>
                <HexagonGrid
                    className="hexagon-grid"
                    width={grid?.pixelWidth}
                    height={grid?.pixelHeight}
                    onMouseLeave={() => onHexHover(undefined)}
                >
                    {grid?.toArray()?.map((hex, index) => {
                        const rendererState = getHexagonRendererState({
                            hex,
                            currentPlayer,
                            playerMoveState,
                            playersGameState,
                        })

                        return (
                            <React.Fragment key={index}>
                                <HexagonInfoTooltip rendererState={rendererState}>
                                    <Hexagon
                                        rendererState={rendererState}
                                        onClick={() => onHexagonClick(hex)}
                                        onMouseEnter={() => onHexHover(hex)}
                                    >
                                        <HexagonRenderer rendererState={rendererState} />
                                    </Hexagon>
                                </HexagonInfoTooltip>
                            </React.Fragment>
                        )
                    })}
                    <HexagonPath hexes={playerMoveState?.path || []} />
                </HexagonGrid>
            </div>
        </div>
    )
}

export default HexaQuest
