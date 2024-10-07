import React, { useState, useEffect } from 'react'

import { Grid, Hex } from 'honeycomb-grid'
import Hexagon, { HexagonProps } from '@components/Hexagon/Hexagon'

export type HexagonGridProps = {
    grid: Grid<Hex> | undefined
    hexProps?: Partial<HexagonProps>
}

const HexagonGrid = ({ grid, hexProps }: HexagonGridProps) => {
    const [hexes, setHexes] = useState<Hex[]>([])

    useEffect(() => {
        setHexes(grid?.toArray() || [])
    }, [grid])

    return (
        <div style={{ position: 'relative', height: grid?.pixelHeight, width: grid?.pixelWidth }}>
            {hexes.map((hex, index) => (
                <div
                    key={index}
                    className="row"
                    style={{
                        position: 'absolute',
                        transform: `translate(${hex.x}px, ${hex.y}px)`,
                    }}
                >
                    <Hexagon hex={hex} {...hexProps} />
                </div>
            ))}
        </div>
    )
}

export default HexagonGrid
