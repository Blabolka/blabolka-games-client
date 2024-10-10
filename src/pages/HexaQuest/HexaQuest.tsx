import React, { useEffect, useState } from 'react'

import classnames from 'classnames'

import Hexagon from '@components/Hexagon/Hexagon'
import HexagonPath from '@components/HexagonPath/HexagonPath'
import HexagonGrid from '@components/HexagonGrid/HexagonGrid'

import { Grid } from 'honeycomb-grid'
import hexagonPathfinding from '@services/hexagon/hexagonPathfinding'
import { GamePlayerMoveState, GamePlayersState, Hex, HexType, TeamType } from '@entityTypes/hexaQuest'
import { getInitialGameConfig, getInitialPlayerMoveState, updateGridWithMoveCosts } from './hexaQuestHelpers'

import './HexaQuest.less'

const HexaQuest = () => {
    const [grid, setGrid] = useState<Grid<Hex>>()
    const [hoveredHex, setHoveredHex] = useState<Hex | undefined>()
    const [playerMoveState, setPlayerMoveState] = useState<GamePlayerMoveState>(getInitialPlayerMoveState())
    const [playersGameState, setPlayersGameState] = useState<GamePlayersState>({
        players: [],
        currentPlayer: undefined,
    })

    useEffect(() => {
        const { grid, players } = getInitialGameConfig()

        setGrid(grid)
        setPlayersGameState({ players, currentPlayer: players[1] })
    }, [])

    useEffect(() => {
        if (!grid || !hoveredHex || !playersGameState?.currentPlayer) {
            setPlayerMoveState(getInitialPlayerMoveState())
            return
        }

        const currentPlayer = playersGameState.currentPlayer

        updateGridWithMoveCosts(grid, currentPlayer.config.type)

        const startHexagon = grid.getHex({ q: currentPlayer.coordinates.q, r: currentPlayer.coordinates.r })
        const goalHexagon = hoveredHex

        if (startHexagon && goalHexagon) {
            setPlayerMoveState({ path: hexagonPathfinding.aStar(grid, startHexagon, goalHexagon) || [] })
        }
    }, [playersGameState, hoveredHex])

    return (
        <div className="center-page justify-start">
            <div className="column align-center">
                <HexagonGrid
                    width={grid?.pixelWidth}
                    height={grid?.pixelHeight}
                    onMouseLeave={() => setHoveredHex(undefined)}
                >
                    {grid?.toArray()?.map((hex, index) => {
                        const currentHexPlayer = playersGameState.players.find((player) => {
                            return hex.q === player.coordinates.q && hex.r === player.coordinates.r
                        })

                        const isCurrentPlayer =
                            currentHexPlayer?.coordinates?.q === playersGameState.currentPlayer?.coordinates?.q &&
                            currentHexPlayer?.coordinates?.r === playersGameState.currentPlayer?.coordinates?.r

                        return (
                            <Hexagon
                                key={index}
                                hex={hex}
                                onMouseEnter={() => setHoveredHex(hex)}
                                className={classnames({
                                    hexagon__water: hex?.config?.type === HexType.WATER,
                                    hexagon__forest: hex?.config?.type === HexType.FOREST,
                                    hexagon__impassable: hex?.config?.type === HexType.IMPASSABLE,
                                    'hexagon__player--enemy': currentHexPlayer?.config?.team === TeamType.ENEMY,
                                    'hexagon__player--friend': currentHexPlayer?.config?.team === TeamType.FRIEND,
                                    'hexagon__current-player': isCurrentPlayer,
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
