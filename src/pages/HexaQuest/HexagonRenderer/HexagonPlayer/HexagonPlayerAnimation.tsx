import React from 'react'
import { useAnimation, UseAnimationHookAnimationType } from '@hooks'

import HexagonImage from '@components/HexagonImage/HexagonImage'

import { HexagonRendererState, PlayerViewDirections } from '@entityTypes/hexaQuest'
import { calculateHexagonPlayerImageSize, getPlayerSpriteConfigByTypeAndAnimation } from './hexagonPlayerHelpers'

export type HexagonCharacterProps = {
    rendererState: Required<Pick<HexagonRendererState, 'player'>> & HexagonRendererState
}

const HexagonPlayer = ({ rendererState }: HexagonCharacterProps) => {
    const { hex, player, animation, isCurrentPlayer } = rendererState

    const elementId = `clip-hexagon-player-${hex.q}-${hex.r}`

    const isFlipped = player.config.lastViewDirection === PlayerViewDirections.LEFT

    const { sprite, frameCount, duration, spriteOffsetX, hookAnimationType } = getPlayerSpriteConfigByTypeAndAnimation(
        player.config.type,
        animation?.animationType,
    )

    const { currentFrame } = useAnimation({
        animationType: !animation && !isCurrentPlayer ? UseAnimationHookAnimationType.STATIC : hookAnimationType,
        frameCount,
        duration,
        onAnimationEnd: () => animation?.onAnimationEnd?.(),
    })

    const { x, y, width, height } = calculateHexagonPlayerImageSize(hex, {
        offsetX: !isFlipped ? spriteOffsetX : -spriteOffsetX,
    })

    const offsetX = currentFrame * width

    return (
        <g aria-label="Hexagon Player Animation">
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
    )
}

export default HexagonPlayer
