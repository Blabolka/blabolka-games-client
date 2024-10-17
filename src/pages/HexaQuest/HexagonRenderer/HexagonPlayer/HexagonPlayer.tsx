import React from 'react'
import { useAnimation } from '@hooks'

import HexagonImage from '@components/HexagonImage/HexagonImage'

import { HexagonRendererState, PlayerViewDirections } from '@entityTypes/hexaQuest'
import { calculateHexagonPlayerImageSize, getPlayerSpriteConfigByType } from './hexagonPlayerHelpers'

export type HexagonCharacterProps = {
    rendererState: HexagonRendererState
}

const HexagonPlayer = ({ rendererState }: HexagonCharacterProps) => {
    const { hex, player, isCurrentPlayer } = rendererState

    const elementId = `clip-hexagon-player-${hex.q}-${hex.r}`

    const isFlipped = player?.config?.lastViewDirection === PlayerViewDirections.LEFT

    const { sprite, frameCount, duration, spriteOffsetX } = getPlayerSpriteConfigByType(player?.config.type)

    const { currentFrame } = useAnimation({ shouldAnimate: isCurrentPlayer, frameCount, duration })
    const { x, y, width, height } = calculateHexagonPlayerImageSize(hex, {
        offsetX: !isFlipped ? spriteOffsetX : -spriteOffsetX,
    })

    const offsetX = currentFrame * width

    return player ? (
        <g>
            <defs>
                <clipPath id={elementId}>
                    <rect x={x} y={y} width={width} height={height} />
                </clipPath>
            </defs>
            <HexagonImage
                image={sprite}
                x={x - offsetX}
                y={y}
                width={width * frameCount}
                height={height}
                clipPath={`url(#${elementId})`}
                style={
                    isFlipped
                        ? {
                              transform: `scaleX(-1)`,
                              transformOrigin: `${x + width / 2}px ${y + height / 2}px`,
                          }
                        : {}
                }
            />
        </g>
    ) : null
}

export default HexagonPlayer
