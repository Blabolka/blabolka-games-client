import React from 'react'

import { HexagonRendererState } from '@entityTypes/hexaQuest'
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
            fontSize={18}
            width={hex.width}
            height={hex.height}
            textAnchor="middle"
            pointerEvents="none"
            fill={getPlayerColorByType(player.config.team)}
        >
            {getPlayerTextByType(player.config.type)}
        </text>
    ) : null
}

export default HexagonPlayer
