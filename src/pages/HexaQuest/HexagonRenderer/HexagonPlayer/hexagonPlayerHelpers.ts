import { Hex } from '@entityTypes/hexaQuest'

export const calculateHexagonPlayerImageSize = (hex: Hex, dimensions) => {
    const width = dimensions.width
    const height = dimensions.height
    const heightDifference = height - dimensions.height

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
