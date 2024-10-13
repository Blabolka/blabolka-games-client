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
    getAvailableHexesToMeleeAttack,
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

    const onPlayerMeleeAttack = () => {}

    const onHexagonClick = (hex: Hex) => {
        switch (playerMoveState.moveType) {
            case MoveType.MOVE:
                onPlayerMove(hex)
                break
            case MoveType.MELEE_ATTACK:
                onPlayerMeleeAttack()
                break
        }
    }

    const onPlayerMeleeAttackStart = () => {
        setPlayerMoveState((state) => ({
            ...state,
            moveType: MoveType.MELEE_ATTACK,
        }))
    }

    const onPlayerMeleeAttackCancel = () => {
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
                    : getAvailableHexesToMeleeAttack(grid, currentPlayer),
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
                <span>Remaining moves: {currentPlayer?.config?.remainingMoveCost}</span>
                <div className="row">
                    <Button
                        size="small"
                        color="inherit"
                        variant={playerMoveState.moveType === MoveType.MELEE_ATTACK ? 'outlined' : 'contained'}
                        onClick={
                            playerMoveState.moveType === MoveType.MELEE_ATTACK
                                ? onPlayerMeleeAttackCancel
                                : onPlayerMeleeAttackStart
                        }
                    >
                        {playerMoveState.moveType === MoveType.MELEE_ATTACK ? 'Cancel attack' : 'Melee attack'}
                    </Button>
                </div>
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
