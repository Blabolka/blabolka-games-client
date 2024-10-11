import React from 'react'

import classnames from 'classnames'
import HexagonImage from '@components/HexagonImage/HexagonImage'

import { HexagonRendererState } from '../HexagonRenderer'
import { getHexagonFieldImageByType, calculateHexagonFieldImageSize } from './hexagonFieldHelpers'

export type HexagonFieldProps = {
    rendererState: HexagonRendererState
}

const HexagonField = ({ rendererState }: HexagonFieldProps) => {
    const { hex } = rendererState
    const { x, y, width, height } = calculateHexagonFieldImageSize(hex)

    return (
        <HexagonImage
            x={x}
            y={y}
            width={width}
            height={height}
            image={getHexagonFieldImageByType(hex.config?.type)}
            className={classnames({
                hexagon__inaccessible: !rendererState.isHexAccessibleByPlayer,
            })}
        />
    )
}

export default HexagonField
