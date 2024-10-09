import React from 'react'

import { Hex } from 'honeycomb-grid'

type AdditionalPolygonProps = {
    hex: Hex
}

export type HexagonProps = AdditionalPolygonProps & React.SVGProps<SVGPolygonElement>

const Hexagon = ({ hex, ...props }: HexagonProps) => {
    return (
        <polygon
            points={hex.corners.map(({ x, y }) => `${x},${y}`).join(' ')}
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2"
            {...props}
        />
    )
}

export default Hexagon
