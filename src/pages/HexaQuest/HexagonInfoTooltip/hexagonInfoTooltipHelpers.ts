import { HexagonRendererState, MoveType } from '@entityTypes/hexaQuest'
import { getAttackConfigByPlayerAndType, sumPathMoveCost } from '../hexaQuestHelpers'

const getHPInfoMessage = (rendererState: HexagonRendererState) => {
    if (!rendererState.player) return ''

    const fullHP = rendererState.player.config.numberOfHealthPoints
    const remainingHP = rendererState.player.config.remainingHealthPoints

    return `HP: ${remainingHP}/${fullHP}`
}

const getTeamInfoMessage = (rendererState: HexagonRendererState) => {
    if (!rendererState.player) return ''
    return `Team: ${rendererState.player.config.team}`
}

export const getMoveCostMessage = (rendererState: HexagonRendererState) => {
    if (!rendererState.isHexAccessibleByPlayer || rendererState.playerMoveState.moveType !== MoveType.MOVE) return ''
    return `- ${sumPathMoveCost(rendererState.playerMoveState.path)} moves`
}

export const getAttackDamageMessage = (rendererState: HexagonRendererState) => {
    if (
        !rendererState.isHexAccessibleByPlayer ||
        ![MoveType.MELEE_ATTACK, MoveType.RANGE_ATTACK].includes(rendererState.playerMoveState.moveType)
    ) {
        return ''
    }

    const attackConfig = getAttackConfigByPlayerAndType(
        rendererState.currentPlayer?.config.type,
        rendererState.playerMoveState.moveType,
    )
    return attackConfig ? `Damage: ${attackConfig.damage}` : ''
}

export const getAccessMessage = (rendererState: HexagonRendererState) => {
    return !rendererState.isHexAccessibleByPlayer ? 'Action unavailable' : ''
}

export const getPlayerInfoMessages = (rendererState: HexagonRendererState) => {
    return [getHPInfoMessage(rendererState), getTeamInfoMessage(rendererState)].filter(Boolean)
}

export const getMoveInfoMessages = (rendererState: HexagonRendererState) => {
    return [
        getMoveCostMessage(rendererState),
        getAttackDamageMessage(rendererState),
        getAccessMessage(rendererState),
    ].filter(Boolean)
}
