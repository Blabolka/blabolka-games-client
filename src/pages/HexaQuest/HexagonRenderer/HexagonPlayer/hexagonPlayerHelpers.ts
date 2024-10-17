import { Hex, PlayerType } from '@entityTypes/hexaQuest'
import ArcherIdle from '@assets/img/spritesheets/Archer_idle.png'
import SpearmanIdle from '@assets/img/spritesheets/Spearman_idle.png'

export const getPlayerSpriteConfigByType = (playerType?: PlayerType) => {
    const commonConfig = { frameWidth: 32, frameHeight: 32, duration: 1 }

    if (playerType === PlayerType.WARRIOR) {
        return { ...commonConfig, sprite: SpearmanIdle, frameCount: 5, spriteOffsetX: 8 }
    }

    if (playerType === PlayerType.ARCHER) {
        return { ...commonConfig, sprite: ArcherIdle, frameCount: 5, spriteOffsetX: 0 }
    }

    return { ...commonConfig, sprite: null, frameCount: 0, spriteOffsetX: 0 }
}

export const calculateHexagonPlayerImageSize = (hex: Hex, options: { offsetX: number }) => {
    const { offsetX = 0 } = options || {}

    const sizeIncreaseFactor = 1.15

    const size = hex.height * sizeIncreaseFactor

    const width = size
    const height = size

    const x = hex.x - width / 2 + offsetX
    const y = hex.y - height / 2 - height / 4

    return {
        x,
        y,
        width,
        height,
    }
}
