import React from 'react'

import { HexagonRendererState } from '@entityTypes/hexaQuest'

import { getTeamBorderColorByType } from './hexagonTeamMarkerHelpers'

export type HexagonTeamMarkerProps = {
    rendererState: HexagonRendererState
}

const HexagonTeamMarker = ({ rendererState }: HexagonTeamMarkerProps) => {
    return rendererState.player ? <g fill={getTeamBorderColorByType(rendererState.player.config.team)}></g> : null
}

export default HexagonTeamMarker
