import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updatePlayerMoveState, updatePlayersGameState, resetPlayerMoveState } from '@redux-actions'
import { getPlayerMoveState, getPlayersGameState } from '@redux-selectors'

import Hexagon from '@components/Hexagon/Hexagon'
import HexagonPath from '@components/HexagonPath/HexagonPath'
import HexagonGrid from '@components/HexagonGrid/HexagonGrid'
import HexagonRenderer from './HexagonRenderer/HexagonRenderer'
import HexaQuestGUI from '@pages/HexaQuest/HexaQuestGUI/HexaQuestGUI'
import HexagonInfoTooltip from './HexagonInfoTooltip/HexagonInfoTooltip'

import { Grid } from 'honeycomb-grid'
import { calculateAdaptiveSvgStrokeWidth, StrokeWidthFactorType } from '@utils/components'
import { Hex, MoveType, Animation, AnimationType, PlayerConfigItem } from '@entityTypes/hexaQuest'
import {
    getPathToMove,
    getPathToAttack,
    sumPathMoveCost,
    getInitialGameConfig,
    getPlayerViewDirection,
    getPlayerByCoordinates,
    getHexagonRendererState,
    getAvailableHexesToMove,
    getAvailableHexesToAttack,
    getAttackConfigByPlayerAndType,
} from './hexaQuestHelpers'

import './HexaQuest.less'

const HexaQuest = () => {
    const dispatch = useDispatch()

    const playerMoveState = useSelector(getPlayerMoveState)
    const playersGameState = useSelector(getPlayersGameState)

    const [grid, setGrid] = useState<Grid<Hex>>()
    const [animations, setAnimations] = useState<Animation[]>([])

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

    const runAnimation = (animation?: Animation) => {
        if (!animation) return

        return new Promise((resolve) => {
            const updatedAnimation: Animation = {
                ...animation,
                onAnimationEnd: () => {
                    setAnimations((state) =>
                        state.filter(
                            (stateAnimation) =>
                                !(
                                    stateAnimation.coordinates.q === animation.coordinates.q &&
                                    stateAnimation.coordinates.r === animation.coordinates.r
                                ),
                        ),
                    )
                    resolve(null)
                },
            }

            setAnimations((state) => [...state, updatedAnimation])
        })
    }

    const onPlayerMove = (hex: Hex) => {
        if (!playerMoveState.path.length) return

        const newPlayerCoordinates = { q: hex.q, r: hex.r }
        const pathCost = sumPathMoveCost(playerMoveState.path)

        dispatch(resetPlayerMoveState())
        dispatch(
            updatePlayersGameState({
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
            }),
        )
    }

    const onPlayerAttack = async (hex: Hex) => {
        const { newPlayersState, animations } = playersGameState.players.reduce(
            (memo, player) => {
                const isCurrentPlayer =
                    player.coordinates.q === playersGameState.currentPlayerCoordinates?.q &&
                    player.coordinates.r === playersGameState.currentPlayerCoordinates?.r
                const isAttackedPlayer = player.coordinates.q === hex.q && player.coordinates.r === hex.r

                if (isCurrentPlayer) {
                    memo.animations.push({
                        coordinates: { q: player.coordinates.q, r: player.coordinates.r },
                        animationType: AnimationType.ATTACK,
                    })

                    memo.newPlayersState.push({
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
                        memo.newPlayersState.push({
                            ...player,
                            config: {
                                ...player.config,
                                remainingHealthPoints,
                            },
                        })
                    } else {
                        memo.animations.push({
                            coordinates: { q: player.coordinates.q, r: player.coordinates.r },
                            animationType: AnimationType.DEATH,
                        })
                    }
                } else {
                    memo.newPlayersState.push(player)
                }

                return memo
            },
            { newPlayersState: [], animations: [] },
        )

        await Promise.all(animations.map((animation) => runAnimation(animation)))

        dispatch(resetPlayerMoveState())
        dispatch(updatePlayersGameState({ players: newPlayersState }))
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
        dispatch(updatePlayerMoveState({ moveType }))
    }

    const onPlayerMoveCancel = () => {
        dispatch(resetPlayerMoveState())
    }

    const onPlayerFinishMove = () => {
        const currentPlayerIndex = playersGameState.players.findIndex((player) => {
            return (
                currentPlayer?.coordinates?.q === player.coordinates.q &&
                currentPlayer?.coordinates?.r === player.coordinates.r
            )
        })

        dispatch(resetPlayerMoveState())
        dispatch(
            updatePlayersGameState({
                currentPlayerCoordinates: (
                    playersGameState.players[currentPlayerIndex + 1] || playersGameState.players[0]
                ).coordinates,
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
            }),
        )
    }

    const onHexagonHover = (hex?: Hex) => {
        const updatePath = (path: Hex[]) => {
            dispatch(updatePlayerMoveState({ path }))
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
                ? getPathToMove(grid, playersGameState.players, currentPlayer, hex)
                : getPathToAttack(grid, currentPlayer, hex),
        )
        dispatch(
            updatePlayersGameState({
                players: playersGameState.players.reduce((memo, player) => {
                    const isCurrentPlayer =
                        player.coordinates.q === playersGameState.currentPlayerCoordinates?.q &&
                        player.coordinates.r === playersGameState.currentPlayerCoordinates?.r

                    if (isCurrentPlayer) {
                        memo.push({
                            ...player,
                            config: {
                                ...player.config,
                                lastViewDirection: getPlayerViewDirection(
                                    { q: player.coordinates.q, r: player.coordinates.r },
                                    { q: hex.q, r: hex.r },
                                    player.config.lastViewDirection,
                                ),
                            },
                        })
                    } else {
                        memo.push(player)
                    }

                    return memo
                }, []),
            }),
        )
    }

    useEffect(() => {
        const { grid: initialGrid, players } = getInitialGameConfig()

        setGrid(initialGrid)
        dispatch(updatePlayersGameState({ players, currentPlayerCoordinates: players[0].coordinates }))
    }, [])

    useEffect(() => {
        if (!grid || !currentPlayer) return

        dispatch(
            updatePlayerMoveState({
                availableHexesToMove:
                    playerMoveState.moveType === MoveType.MOVE
                        ? getAvailableHexesToMove(grid, playersGameState.players, currentPlayer)
                        : getAvailableHexesToAttack(grid, currentPlayer, playerMoveState.moveType),
            }),
        )
    }, [currentPlayer, playerMoveState.moveType, playersGameState.players])

    return (
        <div
            className="center-page hexa-quest__wrapper"
            style={{
                position: 'relative',
                ...(animations.length ? { pointerEvents: 'none' } : {}),
            }}
        >
            <div style={{ position: 'absolute', top: '24px', right: '8px' }}>
                <HexaQuestGUI
                    animations={animations}
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
                    height={grid?.pixelHeight ? grid?.pixelHeight * 1.07 : undefined}
                    viewBox={
                        grid?.pixelWidth && grid?.pixelHeight
                            ? `0 0 ${grid?.pixelWidth} ${grid?.pixelHeight}`
                            : undefined
                    }
                    onMouseLeave={() => onHexagonHover(undefined)}
                >
                    {grid?.toArray()?.map((hex, index) => {
                        const rendererState = getHexagonRendererState({
                            hex,
                            animations,
                            currentPlayer,
                            playerMoveState,
                            playersGameState,
                        })

                        return (
                            <g key={index} aria-label="Hexagon Group">
                                <HexagonInfoTooltip rendererState={rendererState}>
                                    <Hexagon
                                        className="hexagon"
                                        aria-label="Hexagon Shape"
                                        corners={hex.corners}
                                        strokeWidth={calculateAdaptiveSvgStrokeWidth(
                                            hex.height,
                                            StrokeWidthFactorType.SMALL,
                                        )}
                                        onMouseEnter={() => onHexagonHover(hex)}
                                        onClick={
                                            rendererState?.isHexAccessibleByPlayer
                                                ? () => onHexagonClick(hex)
                                                : () => {}
                                        }
                                    />
                                </HexagonInfoTooltip>
                                <HexagonRenderer rendererState={rendererState} />
                            </g>
                        )
                    })}
                    <HexagonPath
                        hexes={playerMoveState?.path || []}
                        strokeWidth={calculateAdaptiveSvgStrokeWidth(
                            grid?.getHex({ q: 0, r: 0 })?.height,
                            StrokeWidthFactorType.LARGE,
                        )}
                    />
                </HexagonGrid>
            </div>
        </div>
    )
}

export default HexaQuest
