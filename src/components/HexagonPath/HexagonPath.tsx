import React from 'react'

import { Hex } from 'honeycomb-grid'

type AdditionalPathProps = {
    hexes: Hex[]
}

export type HexagonPathProps = AdditionalPathProps & React.SVGProps<SVGPathElement>

const HexagonPath = ({ hexes, ...props }: HexagonPathProps) => {
    return (
        <path
            d={hexes.map((hex, index) => (index === 0 ? `M ${hex.x},${hex.y}` : `L ${hex.x},${hex.y}`)).join(' ')}
            fill="none"
            stroke="#000000"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pointerEvents="none"
            {...props}
        />
    )
}

export default HexagonPath
