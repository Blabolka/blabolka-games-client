import React from 'react'

import { Hex } from '@entityTypes/hexaQuest'

type AdditionalHexagonProps = {
    hex: Hex
}

export type HexagonProps = AdditionalHexagonProps & React.SVGProps<SVGPolygonElement>

const Hexagon = ({ hex, children, ...props }: HexagonProps) => {
    const hexPoints = hex.corners.map(({ x, y }) => `${x},${y}`).join(' ')

    return (
        <>
            <polygon points={hexPoints} fill="#FFFFFF" stroke="#000000" strokeWidth="2" {...props} />
            {children}
        </>
    )
}

export default Hexagon
