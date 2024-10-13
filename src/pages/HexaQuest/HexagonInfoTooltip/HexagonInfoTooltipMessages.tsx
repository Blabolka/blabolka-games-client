import React from 'react'

import { HexagonRendererState } from '@entityTypes/hexaQuest'
import { getPlayerInfoMessages, getMoveInfoMessages } from '../HexagonInfoTooltip/hexagonInfoTooltipHelpers'

export type HexagonInfoTooltipMessagesProps = {
    rendererState: HexagonRendererState
}

const HexagonInfoTooltipMessages = ({ rendererState }: HexagonInfoTooltipMessagesProps) => {
    const playerInfoMessages = getPlayerInfoMessages(rendererState)
    const moveInfoMessages = getMoveInfoMessages(rendererState)

    return playerInfoMessages.length || moveInfoMessages.length ? (
        <div className="column gap-8">
            {playerInfoMessages.length ? (
                <div className="column">
                    {playerInfoMessages.map((message, index) => (
                        <span key={index}>{message}</span>
                    ))}
                </div>
            ) : null}
            {moveInfoMessages.length ? (
                <div className="column">
                    {moveInfoMessages.map((message, index) => (
                        <span key={index}>{message}</span>
                    ))}
                </div>
            ) : null}
        </div>
    ) : null
}

export default HexagonInfoTooltipMessages
