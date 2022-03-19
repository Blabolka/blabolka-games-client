import React, { ReactNode } from 'react'

import './GameInfoPanel.less'

type GameInfoPanelProps = {
    children: ReactNode
}

const GameInfoPanel = ({ children }: GameInfoPanelProps) => {
    return <div className="game-info-panel">{children}</div>
}

export default GameInfoPanel
