import React from 'react'

import { HexagonRendererState } from '@entityTypes/hexaQuest'

import { calculateAdaptiveSvgStrokeWidth } from '@utils/components'
import { calculateTeamMarkerPoints, getTeamBorderColorByType } from './hexagonTeamMarkerHelpers'

export type HexagonTeamMarkerProps = {
    rendererState: HexagonRendererState
}

const HexagonTeamMarker = ({ rendererState }: HexagonTeamMarkerProps) => {
    return rendererState.player ? (
        <polygon
            pointerEvents="none"
            points={calculateTeamMarkerPoints(rendererState.hex)}
            stroke={getTeamBorderColorByType(rendererState.player.config.team)}
            strokeWidth={calculateAdaptiveSvgStrokeWidth(rendererState.hex.height)}
            fill={rendererState.isCurrentPlayer ? getTeamBorderColorByType(rendererState.player.config.team) : 'none'}
        />
    ) : null
}

export default HexagonTeamMarker
