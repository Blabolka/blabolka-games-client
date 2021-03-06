import React from 'react'

import roomImage from '@assets/img/room-icon.svg'

const FullRoom = () => {
    return (
        <div className="center-page">
            <div className="column">
                <img src={roomImage} alt="Room is full image" className="empty-state-image" />
                <div className="column text-align-center">
                    <span className="font-size-22px font-weight-medium">The Room is full</span>
                    <span className="font-size-14px" style={{ marginTop: '10px' }}>
                        Find another room or create your own
                    </span>
                </div>
            </div>
        </div>
    )
}

export default FullRoom
