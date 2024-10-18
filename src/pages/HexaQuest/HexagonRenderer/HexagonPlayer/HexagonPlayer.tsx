import React from 'react'

import HexagonPlayerAnimation from './HexagonPlayerAnimation'

import { HexagonRendererState } from '@entityTypes/hexaQuest'

export type HexagonCharacterProps = {
    rendererState: HexagonRendererState
}

const HexagonPlayer = ({ rendererState }: HexagonCharacterProps) => {
    const { player } = rendererState

    return player ? <HexagonPlayerAnimation rendererState={{ ...rendererState, player }} /> : null
}

export default HexagonPlayer
