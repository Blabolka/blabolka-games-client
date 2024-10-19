import React from 'react'

import HexagonField from './HexagonField/HexagonField'
import HexagonPlayer from './HexagonPlayer/HexagonPlayer'
import HexagonTeamMarker from '@pages/HexaQuest/HexagonRenderer/HexagonTeamMarker/HexagonTeamMarker'

import { HexagonRendererState } from '@entityTypes/hexaQuest'

export type HexagonRendererProps = {
    rendererState: HexagonRendererState
}

const HexagonRenderer = ({ rendererState }: HexagonRendererProps) => {
    return (
        <g aria-label="Hexagon Renderer">
            <HexagonField rendererState={rendererState} />
            <HexagonPlayer rendererState={rendererState} />
            <HexagonTeamMarker rendererState={rendererState} />
        </g>
    )
}

export default HexagonRenderer
