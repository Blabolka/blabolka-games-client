import React from 'react'

import { PlayerType, TeamType } from '@entityTypes/hexaQuest'
import { HexagonRendererState } from '../HexagonRenderer'

export type HexagonCharacterProps = {
    rendererState: HexagonRendererState
}

const HexagonPlayer = ({ rendererState }: HexagonCharacterProps) => {
    const { hex, player } = rendererState

    const getPlayerTextByType = (playerType: PlayerType) => {
        switch (playerType) {
            case PlayerType.WARRIOR: {
                return 'Warrior'
            }
        }
    }

    const getPlayerColorByType = (teamType: TeamType) => {
        switch (teamType) {
            case TeamType.FRIEND: {
                return 'blue'
            }
            case TeamType.ENEMY: {
                return 'red'
            }
        }
    }

    return player ? (
        <text
            x={hex.x}
            y={hex.y + 4}
            width={hex.width}
            height={hex.height}
            textAnchor="middle"
            fontSize={18}
            fill={getPlayerColorByType(player.config.team)}
            pointerEvents="none"
        >
            {getPlayerTextByType(player.config.type)}
        </text>
    ) : null
}

export default HexagonPlayer
