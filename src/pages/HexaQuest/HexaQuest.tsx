import React, { useEffect, useMemo, useState } from 'react'

import Button from '@mui/material/Button'
import Hexagon from '@components/Hexagon/Hexagon'
import HexagonPath from '@components/HexagonPath/HexagonPath'
import HexagonGrid from '@components/HexagonGrid/HexagonGrid'
import HexagonRenderer from '@pages/HexaQuest/HexagonRenderer/HexagonRenderer'

import { Grid } from 'honeycomb-grid'
import hexagonPathfinding from '@services/hexagon/hexagonPathfinding'
import { GamePlayerMoveState, GamePlayersState, Hex, PlayerConfigItem } from '@entityTypes/hexaQuest'
import {
    sumPathMoveCost,
    getInitialGameConfig,
    getAvailableHexesToMove,
    getInitialPlayerMoveState,
    getGridWithUpdatedMoveCosts,
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

        const updatedGrid = getGridWithUpdatedMoveCosts(grid, currentPlayer.config.type)

        const startHexagon = updatedGrid.getHex({ q: currentPlayer.coordinates.q, r: currentPlayer.coordinates.r })
        const goalHexagon = updatedGrid.getHex({ q: hoveredHex.q, r: hoveredHex.r })

        if (startHexagon && goalHexagon) {
            setPlayerMoveState((state) => ({
                ...state,
                path: hexagonPathfinding.aStar(updatedGrid, startHexagon, goalHexagon) || [],
            }))
        }
    }, [currentPlayer, playerMoveState.availableHexesToMove, hoveredHex])

    return (
        <div className="center-page justify-start" style={{ position: 'relative' }}>
            <div className="column gap-4 hexa-quest__gui" style={{ position: 'absolute', top: '24px', right: '8px' }}>
                <span>Remaining moves: {currentPlayer?.config?.remainingMoveCost}</span>
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
                        return (
                            <Hexagon
                                key={index}
                                hex={hex}
                                onClick={() => onPlayerMove(hex)}
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
