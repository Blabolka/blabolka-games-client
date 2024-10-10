import React, { useEffect, useState, useMemo } from 'react'

import classnames from 'classnames'

import Button from '@mui/material/Button'
import Hexagon from '@components/Hexagon/Hexagon'
import HexagonPath from '@components/HexagonPath/HexagonPath'
import HexagonGrid from '@components/HexagonGrid/HexagonGrid'

import { Grid } from 'honeycomb-grid'
import hexagonPathfinding from '@services/hexagon/hexagonPathfinding'
import { GamePlayerMoveState, GamePlayersState, Hex, HexType, PlayerConfigItem, TeamType } from '@entityTypes/hexaQuest'
import {
    sumPathMoveCost,
    getInitialGameConfig,
    updateGridWithMoveCosts,
    getAvailableHexesToMove,
    getInitialPlayerMoveState,
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
            playersGameState.players.find(
                (player) =>
                    player.coordinates.q === playersGameState.currentPlayerCoordinates?.q &&
                    player.coordinates.r === playersGameState.currentPlayerCoordinates?.r,
            ),
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

    const onPlayerFinishMove = () => {
        const currentPlayerIndex = playersGameState.players.findIndex((player) => {
            return (
                currentPlayer?.coordinates?.q === player.coordinates.q &&
                currentPlayer?.coordinates?.r === player.coordinates.r
            )
        })

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
            availableHexesToMove: getAvailableHexesToMove(grid, currentPlayer),
        }))
    }, [currentPlayer])

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

        updateGridWithMoveCosts(grid, currentPlayer.config.type)

        const startHexagon = grid.getHex({ q: currentPlayer.coordinates.q, r: currentPlayer.coordinates.r })
        const goalHexagon = hoveredHex

        if (startHexagon && goalHexagon) {
            setPlayerMoveState((state) => ({
                ...state,
                path: hexagonPathfinding.aStar(grid, startHexagon, goalHexagon) || [],
            }))
        }
    }, [currentPlayer, playerMoveState.availableHexesToMove, hoveredHex])

    return (
        <div className="center-page justify-start" style={{ position: 'relative' }}>
            <div className="column gap-4 hexa-quest__gui" style={{ position: 'absolute', top: '24px', right: '8px' }}>
                <span>Remaining move cost: {currentPlayer?.config?.remainingMoveCost}</span>
                <Button variant="contained" color="inherit" size="small" onClick={onPlayerFinishMove}>
                    Finish move
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
                        const currentHexPlayer = playersGameState.players.find((player) => {
                            return hex.q === player.coordinates.q && hex.r === player.coordinates.r
                        })

                        const isCurrentPlayer =
                            currentHexPlayer?.coordinates?.q === currentPlayer?.coordinates?.q &&
                            currentHexPlayer?.coordinates?.r === currentPlayer?.coordinates?.r

                        const isHexAccessibleByPlayer = playerMoveState.availableHexesToMove.some(
                            (availableHex) => availableHex.q === hex.q && availableHex.r === hex.r,
                        )

                        return (
                            <Hexagon
                                key={index}
                                hex={hex}
                                onClick={() => onPlayerMove(hex)}
                                onMouseEnter={() => setHoveredHex(hex)}
                                className={classnames({
                                    'hexagon__current-player': isCurrentPlayer,
                                    'hexagon__player--enemy': currentHexPlayer?.config?.team === TeamType.ENEMY,
                                    'hexagon__player--friend': currentHexPlayer?.config?.team === TeamType.FRIEND,
                                    hexagon__inaccessible: !isHexAccessibleByPlayer,
                                    hexagon__water: hex?.config?.type === HexType.WATER,
                                    hexagon__forest: hex?.config?.type === HexType.FOREST,
                                    hexagon__impassable: hex?.config?.type === HexType.IMPASSABLE,
                                })}
                            />
                        )
                    })}
                    <HexagonPath hexes={playerMoveState?.path || []} />
                </HexagonGrid>
            </div>
        </div>
    )
}

export default HexaQuest
