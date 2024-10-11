import React from 'react'

import GrassImage from '@assets/img/hexagons/grass.png'
import BushImage from '@assets/img/hexagons/bushes.png'
import WaterImage from '@assets/img/hexagons/water.png'
import ForestImage from '@assets/img/hexagons/forest.png'

import classnames from 'classnames'
import HexagonImage from '@components/HexagonImage/HexagonImage'

import { HexType } from '@entityTypes/hexaQuest'
import { HexagonRendererState } from '../HexagonRenderer'

export type HexagonFieldProps = {
    rendererState: HexagonRendererState
}

const HexagonField = ({ rendererState }: HexagonFieldProps) => {
    const { hex } = rendererState

    const widthIncreaseFactor = 20
    const heightIncreaseFactor = 24
    const updatedImageWidth = hex.width + widthIncreaseFactor
    const updatedImageHeight = hex.height + heightIncreaseFactor

    const getHexagonFieldImageByType = (hexType?: HexType) => {
        switch (hexType) {
            case HexType.BUSH:
                return BushImage
            case HexType.FOREST:
                return ForestImage
            case HexType.WATER:
                return WaterImage
            default:
                return GrassImage
        }
    }

    return (
        <HexagonImage
            image={getHexagonFieldImageByType(hex.config?.type)}
            width={updatedImageWidth}
            height={updatedImageHeight}
            x={hex.x - updatedImageWidth / 2}
            y={hex.y - updatedImageHeight / 2 - heightIncreaseFactor / 2}
            className={classnames({
                hexagon__inaccessible: !rendererState.isHexAccessibleByPlayer,
            })}
        />
    )
}

export default HexagonField
