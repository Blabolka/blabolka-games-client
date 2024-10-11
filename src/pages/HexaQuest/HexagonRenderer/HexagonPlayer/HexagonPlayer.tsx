import React from 'react'

import { HexagonRendererState } from '../HexagonRenderer'
import { getPlayerTextByType, getPlayerColorByType } from './hexagonPlayerHelpers'

export type HexagonCharacterProps = {
    rendererState: HexagonRendererState
}

const HexagonPlayer = ({ rendererState }: HexagonCharacterProps) => {
    const { hex, player } = rendererState

    return player ? (
        <text
            x={hex.x}
            y={hex.y + 4}
            width={hex.width}
            height={hex.height}
            textAnchor="middle"
            fontSize={18}
            fill={getPlayerColorByType(player.config.team)}
            pointerEvents="none"
        >
            {getPlayerTextByType(player.config.type)}
        </text>
    ) : null
}

export default HexagonPlayer
