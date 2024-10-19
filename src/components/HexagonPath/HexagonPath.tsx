import React from 'react'

import { Hex } from 'honeycomb-grid'

type AdditionalHexagonPathProps = {
    hexes: Hex[]
}

export type HexagonPathProps = AdditionalHexagonPathProps & React.SVGProps<SVGPathElement>

const HexagonPath = ({ hexes, ...props }: HexagonPathProps) => {
    const d = hexes.map((hex, index) => (index === 0 ? `M ${hex.x},${hex.y}` : `L ${hex.x},${hex.y}`)).join(' ')

    return (
        <path
            d={d}
            fill="none"
            strokeWidth="1"
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
            pointerEvents="none"
            {...props}
        />
    )
}

export default HexagonPath
