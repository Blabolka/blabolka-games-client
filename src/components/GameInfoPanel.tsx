import React, { CSSProperties, ReactNode } from 'react'

import './GameInfoPanel.less'

type GameInfoPanelProps = {
    children: ReactNode
    styles: CSSProperties
}

const GameInfoPanel = ({ children, styles }: GameInfoPanelProps) => {
    return (
        <div style={styles} className="game-info-panel">
            {children}
        </div>
    )
}

export default GameInfoPanel
