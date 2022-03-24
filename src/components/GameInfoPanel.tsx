import React, { ReactNode } from 'react'

import './GameInfoPanel.less'

type GameInfoPanelProps = {
    children: ReactNode
    height: string
}

const GameInfoPanel = ({ children, height }: GameInfoPanelProps) => {
    return (
        <div style={{ height: height }} className="game-info-panel">
            {children}
        </div>
    )
}

export default GameInfoPanel
