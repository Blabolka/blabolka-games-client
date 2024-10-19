import React from 'react'

import { Point } from 'honeycomb-grid'

type AdditionalHexagonProps = {
    corners: Point[]
}

export type HexagonProps = AdditionalHexagonProps & React.SVGProps<SVGPolygonElement>

const Hexagon = ({ corners, children, ...props }: HexagonProps) => {
    const hexPoints = corners.map(({ x, y }) => `${x},${y}`).join(' ')

    return (
        <>
            <polygon points={hexPoints} fill="#FFFFFF" stroke="#000000" strokeWidth="1" {...props} />
            {children}
        </>
    )
}

export default Hexagon
