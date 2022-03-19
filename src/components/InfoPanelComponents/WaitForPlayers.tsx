import React from 'react'

import './WaitForPlayers.less'

const WaitForPlayers = () => {
    return (
        <span className="font-size-24px font-weight-medium">
            Ожидание игроков<span className="loading-dots">...</span>
        </span>
    )
}

export default WaitForPlayers
