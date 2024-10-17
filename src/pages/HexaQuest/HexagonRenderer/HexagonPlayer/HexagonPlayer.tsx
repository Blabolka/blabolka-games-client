import React from 'react'
import { useAnimation } from '@hooks'

import HexagonImage from '@components/HexagonImage/HexagonImage'

import ArcherIdle from '@assets/img/spritesheets/Archer_idle.png'

import { HexagonRendererState } from '@entityTypes/hexaQuest'
import { calculateHexagonPlayerImageSize } from './hexagonPlayerHelpers'

export type HexagonCharacterProps = {
    rendererState: HexagonRendererState
}

const HexagonPlayer = ({ rendererState }: HexagonCharacterProps) => {
    const { hex, player } = rendererState
    const elementId = `clip-hexagon-player-${hex.q}-${hex.r}`

    const frameWidth = 64
    const frameHeight = 64
    const frameCount = 5
    const duration = 1

    const { currentFrame } = useAnimation({ frameCount, duration })

    const { x, y, width, height } = calculateHexagonPlayerImageSize(hex, { width: frameWidth, height: frameHeight })

    const offsetX = currentFrame * width

    return player ? (
        <g>
            <defs>
                <clipPath id={elementId}>
                    <rect x={x} y={y} width={width} height={height} />
                </clipPath>
            </defs>
            <HexagonImage
                image={ArcherIdle}
                x={x - offsetX}
                y={y}
                width={width * frameCount}
                height={height}
                clipPath={`url(#${elementId})`}
            />
        </g>
    ) : null
}

export default HexagonPlayer
