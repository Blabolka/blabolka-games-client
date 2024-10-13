import React from 'react'

import { HexagonRendererState } from '@entityTypes/hexaQuest'

type AdditionalHexagonProps = {
    rendererState: HexagonRendererState
}

export type HexagonProps = AdditionalHexagonProps & React.SVGProps<SVGPolygonElement>

const Hexagon = ({ rendererState, children, ...props }: HexagonProps) => {
    const hexPoints = rendererState.hex.corners.map(({ x, y }) => `${x},${y}`).join(' ')

    return (
        <>
            <polygon points={hexPoints} fill="#FFFFFF" stroke="#000000" strokeWidth="2" {...props} />
            {children}
        </>
    )
}

export default Hexagon
