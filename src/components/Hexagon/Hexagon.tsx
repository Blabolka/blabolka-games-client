import React from 'react'

import { Hex } from '@entityTypes/hexaQuest'

type AdditionalHexagonProps = {
    hex: Hex
}

export type HexagonProps = AdditionalHexagonProps & React.SVGProps<SVGPolygonElement>

const Hexagon = ({ hex, ...props }: HexagonProps) => {
    const hexPoints = hex.corners.map(({ x, y }) => `${x},${y}`).join(' ')

    return (
        <g>
            <polygon points={hexPoints} fill="#FFFFFF" stroke="#000000" strokeWidth="2" {...props} />
            {props.children}
        </g>
    )
}

export default Hexagon
