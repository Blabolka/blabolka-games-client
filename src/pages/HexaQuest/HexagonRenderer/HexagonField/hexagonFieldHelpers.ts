import { Hex, HexType } from '@entityTypes/hexaQuest'
import BushImage from '@assets/img/resources/hexagons/bushes.png'
import GrassImage from '@assets/img/resources/hexagons/grass.png'
import WaterImage from '@assets/img/resources/hexagons/water.png'
import ForestImage from '@assets/img/resources/hexagons/forest.png'

export const getHexagonFieldImageByType = (hexType?: HexType) => {
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

/**
 * Hexagon images has 32x32 px dimensions
 * There is empty space from top, left and right
 * This reserved space is required for creating images that overflows base hexagon size to show hexagon 3d effect
 */
export const calculateHexagonFieldImageSize = (hex: Hex) => {
    const widthIncreaseFactor = 1.28
    const heightIncreaseFactor = 1.36

    const width = hex.width * widthIncreaseFactor
    const height = hex.height * heightIncreaseFactor
    const heightDifference = height - hex.height

    // We have reserved space from left and right and should only center image
    const x = hex.x - width / 2
    // Here we have only reserved space from top and should center image and subtract height difference
    const y = hex.y - height / 2 - heightDifference / 2

    return {
        x,
        y,
        width,
        height,
    }
}
