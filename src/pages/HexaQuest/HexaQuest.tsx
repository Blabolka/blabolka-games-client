import React, { useEffect, useMemo, useState } from 'react'

import Button from '@mui/material/Button'
import Hexagon from '@components/Hexagon/Hexagon'
import HexagonPath from '@components/HexagonPath/HexagonPath'
import HexagonGrid from '@components/HexagonGrid/HexagonGrid'
import HexagonRenderer from '@pages/HexaQuest/HexagonRenderer/HexagonRenderer'

import { Grid } from 'honeycomb-grid'
import { GamePlayerMoveState, GamePlayersState, Hex, MoveType, PlayerConfigItem } from '@entityTypes/hexaQuest'
import {
    getPathToMove,
    getPathToAttack,
    sumPathMoveCost,
    getInitialGameConfig,
    getPlayerByCoordinates,
    getAvailableHexesToMove,
    getInitialPlayerMoveState,
    getAvailableHexesToAttack,
} from './hexaQuestHelpers'

import './HexaQuest.less'

const HexaQuest = () => {
    const [grid, setGrid] = useState<Grid<Hex>>()
    const [hoveredHex, setHoveredHex] = useState<Hex | undefined>()
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
                    // TODO now we just remove player by in future should implement logic of change of damage
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

    useEffect(() => {
        const { grid, players } = getInitialGameConfig()

        setGrid(grid)
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

    useEffect(() => {
        const resetPath = () => {
            setPlayerMoveState((state) => ({ ...state, path: [] }))
        }

        if (!grid || !hoveredHex || !currentPlayer) {
            return resetPath()
        }

        const isHexAccessibleByPlayer = playerMoveState.availableHexesToMove.some(
            (availableHex) => availableHex.q === hoveredHex.q && availableHex.r === hoveredHex.r,
        )
        if (!isHexAccessibleByPlayer) {
            return resetPath()
        }

        const path =
            playerMoveState.moveType === MoveType.MOVE
                ? getPathToMove(grid, currentPlayer, playersGameState.players, hoveredHex)
                : getPathToAttack(grid, currentPlayer, hoveredHex)

        setPlayerMoveState((state) => ({
            ...state,
            path,
        }))
    }, [
        hoveredHex,
        currentPlayer,
        playersGameState.players,
        playerMoveState.moveType,
        playerMoveState.availableHexesToMove,
    ])

    return (
        <div className="center-page justify-start" style={{ position: 'relative' }}>
            <div className="column gap-4 hexa-quest__gui" style={{ position: 'absolute', top: '24px', right: '8px' }}>
                <span>Remaining actions: {currentPlayer?.config?.remainingActions}</span>
                <span>Remaining moves: {currentPlayer?.config?.remainingMoveCost}</span>
                <Button
                    size="small"
                    color="inherit"
                    disabled={!currentPlayer?.config?.remainingActions}
                    variant={playerMoveState.moveType === MoveType.MELEE_ATTACK ? 'outlined' : 'contained'}
                    onClick={
                        playerMoveState.moveType === MoveType.MELEE_ATTACK
                            ? onPlayerMoveCancel
                            : () => onPlayerAttackStart(MoveType.MELEE_ATTACK)
                    }
                >
                    {playerMoveState.moveType === MoveType.MELEE_ATTACK ? 'Cancel attack' : 'Melee attack'}
                </Button>
                <Button
                    size="small"
                    color="inherit"
                    disabled={!currentPlayer?.config?.remainingActions}
                    variant={playerMoveState.moveType === MoveType.RANGE_ATTACK ? 'outlined' : 'contained'}
                    onClick={
                        playerMoveState.moveType === MoveType.RANGE_ATTACK
                            ? onPlayerMoveCancel
                            : () => onPlayerAttackStart(MoveType.RANGE_ATTACK)
                    }
                >
                    {playerMoveState.moveType === MoveType.RANGE_ATTACK ? 'Cancel attack' : 'Range attack'}
                </Button>
                <Button variant="contained" color="inherit" size="small" onClick={onPlayerFinishMove}>
                    End turn
                </Button>
            </div>
            <div className="column align-center">
                <HexagonGrid
                    className="hexagon-grid"
                    width={grid?.pixelWidth}
                    height={grid?.pixelHeight}
                    onMouseLeave={() => setHoveredHex(undefined)}
                >
                    {grid?.toArray()?.map((hex, index) => {
                        return (
                            <Hexagon
                                key={index}
                                hex={hex}
                                onClick={() => onHexagonClick(hex)}
                                onMouseEnter={() => setHoveredHex(hex)}
                            >
                                <HexagonRenderer
                                    hex={hex}
                                    currentPlayer={currentPlayer}
                                    playerMoveState={playerMoveState}
                                    playersGameState={playersGameState}
                                />
                            </Hexagon>
                        )
                    })}
                    <HexagonPath hexes={playerMoveState?.path || []} />
                </HexagonGrid>
            </div>
        </div>
    )
}

export default HexaQuest
