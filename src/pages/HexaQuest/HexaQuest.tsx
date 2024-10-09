import React, { useState, useEffect, useMemo } from 'react'

import classnames from 'classnames'

import Hexagon from '@components/Hexagon/Hexagon'
import HexagonPath from '@components/HexagonPath/HexagonPath'
import HexagonGrid from '@components/HexagonGrid/HexagonGrid'

import { Grid } from 'honeycomb-grid'
import { Hex, HexType } from '@entityTypes/hexaQuest'
import { getInitialGridConfig } from './hexaQuestHelpers'
import hexagonPathfinding from '@services/hexagon/hexagonPathfinding'

import './HexaQuest.less'

const HEXAGON_CURRENT_PLAYER = { q: 2, r: 2 }

const HexaQuest = () => {
    const [shortestPath, setShortestPath] = useState<Hex[]>([])
    const [hoveredHex, setHoveredHex] = useState<Hex | undefined>()

    const grid: Grid<Hex> = useMemo(() => getInitialGridConfig(), [])

    useEffect(() => {
        if (!grid || !hoveredHex) {
            setShortestPath([])
            return
        }

        const startHexagon = grid.getHex({ q: HEXAGON_CURRENT_PLAYER.q, r: HEXAGON_CURRENT_PLAYER.r })
        const goalHexagon = hoveredHex

        if (startHexagon && goalHexagon) {
            setShortestPath(hexagonPathfinding.aStar(grid, startHexagon, goalHexagon) || [])
        }
    }, [hoveredHex])

    return (
        <div className="center-page justify-start">
            <div className="column align-center">
                <HexagonGrid
                    width={grid?.pixelWidth}
                    height={grid?.pixelHeight}
                    onMouseLeave={() => setHoveredHex(undefined)}
                >
                    {grid?.toArray()?.map((hex, index) => {
                        return (
                            <Hexagon
                                key={index}
                                hex={hex}
                                onMouseEnter={() => setHoveredHex(hex)}
                                className={classnames({
                                    hexagon__water: hex?.config?.type === HexType.WATER,
                                    hexagon__forest: hex?.config?.type === HexType.FOREST,
                                    hexagon__impassable: hex?.config?.type === HexType.IMPASSABLE,
                                    hexagon__player:
                                        hex.q === HEXAGON_CURRENT_PLAYER.q && hex.r === HEXAGON_CURRENT_PLAYER.r,
                                })}
                            />
                        )
                    })}
                    <HexagonPath hexes={shortestPath} />
                </HexagonGrid>
            </div>
        </div>
    )
}

export default HexaQuest
