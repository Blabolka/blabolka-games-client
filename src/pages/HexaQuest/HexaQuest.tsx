import React, { useState, useEffect } from 'react'

import HexagonGrid from '@components/HexagonGrid/HexagonGrid'
import { Grid, Hex, defineHex, rectangle } from 'honeycomb-grid'

import './HexaQuest.less'

const HexaQuest = () => {
    const [grid, setGrid] = useState<Grid<Hex>>()

    useEffect(() => {
        const Tile = defineHex({ dimensions: 40 })
        const grid = new Grid(Tile, rectangle({ width: 10, height: 10 }))
        setGrid(grid)
    }, [])

    return (
        <div className="center-page justify-start">
            <div className="column align-center">
                <HexagonGrid grid={grid} hexProps={{ polygonProps: { className: 'single-hexagon' } }} />
            </div>
        </div>
    )
}

export default HexaQuest
