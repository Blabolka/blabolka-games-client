import React from 'react'

import classnames from 'classnames'
import HexagonImage from '@components/HexagonImage/HexagonImage'

import { HexagonRendererState } from '@entityTypes/hexaQuest'
import { getHexagonFieldImageByType, calculateHexagonFieldImageSize } from './hexagonFieldHelpers'

export type HexagonFieldProps = {
    rendererState: HexagonRendererState
}

const HexagonField = ({ rendererState }: HexagonFieldProps) => {
    const { hex } = rendererState
    const { x, y, width, height } = calculateHexagonFieldImageSize(hex)

    return (
        <>
            <HexagonImage
                x={x}
                y={y}
                width={width}
                height={height}
                aria-label="Hexagon Field Image"
                image={getHexagonFieldImageByType(hex.config?.type)}
                className={classnames({
                    hexagon__inaccessible: !rendererState.isHexAccessibleByPlayer,
                })}
            />
            <text x={hex.x} y={hex.y}>
                ({hex.q},{hex.r})
            </text>
        </>
    )
}

export default HexagonField
