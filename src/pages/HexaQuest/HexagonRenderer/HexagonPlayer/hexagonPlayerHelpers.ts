import { UseAnimationHookAnimationType } from '@hooks'
import { AnimationType, Hex, PlayerType } from '@entityTypes/hexaQuest'

import ArcherIdle from '@assets/img/inline/spritesheets/Archer_idle.png'
import ArcherAttack from '@assets/img/inline/spritesheets/Archer_attack.png'
import SpearmanIdle from '@assets/img/inline/spritesheets/Spearman_idle.png'
import SpearmanDeath from '@assets/img/inline/spritesheets/Spearman_death.png'
import SpearmanAttack from '@assets/img/inline/spritesheets/Spearman_attack.png'

export const getPlayerSpriteConfigByTypeAndAnimation = (playerType: PlayerType, animationType?: AnimationType) => {
    const commonConfig = { frameWidth: 32, frameHeight: 32, duration: 1, spriteOffsetX: 0 }

    if (playerType === PlayerType.WARRIOR && animationType === AnimationType.ATTACK) {
        return {
            ...commonConfig,
            sprite: SpearmanAttack,
            frameCount: 10,
            spriteOffsetX: 4,
            hookAnimationType: UseAnimationHookAnimationType.SINGLE,
        }
    }

    if (playerType === PlayerType.WARRIOR && animationType === AnimationType.DEATH) {
        return {
            ...commonConfig,
            sprite: SpearmanDeath,
            frameCount: 7,
            spriteOffsetX: 4,
            hookAnimationType: UseAnimationHookAnimationType.SINGLE,
        }
    }

    if (playerType === PlayerType.WARRIOR) {
        return {
            ...commonConfig,
            sprite: SpearmanIdle,
            frameCount: 5,
            spriteOffsetX: 4,
            hookAnimationType: UseAnimationHookAnimationType.INFINITE,
        }
    }

    if (playerType === PlayerType.ARCHER && animationType === AnimationType.ATTACK) {
        return {
            ...commonConfig,
            sprite: ArcherAttack,
            frameCount: 9,
            hookAnimationType: UseAnimationHookAnimationType.SINGLE,
        }
    }

    if (playerType === PlayerType.ARCHER) {
        return {
            ...commonConfig,
            sprite: ArcherIdle,
            frameCount: 5,
            hookAnimationType: UseAnimationHookAnimationType.INFINITE,
        }
    }

    return { ...commonConfig, sprite: null, frameCount: 0, hookAnimationType: UseAnimationHookAnimationType.STATIC }
}

export const calculateHexagonPlayerImageSize = (hex: Hex, options: { offsetX: number }) => {
    const { offsetX = 0 } = options || {}

    const sizeIncreaseFactor = 1.2

    const size = hex.height * sizeIncreaseFactor
    const sizeDifference = size - hex.height

    const offsetIncreasedValue = sizeDifference / 2
    const updatedOffsetX = offsetX + (offsetX !== 0 ? Math.sign(offsetX) * offsetIncreasedValue : 0)

    const width = size
    const height = size

    const x = hex.x - width / 2 + updatedOffsetX
    const y = hex.y - height / 2 - height / 4

    return {
        x,
        y,
        width,
        height,
    }
}
