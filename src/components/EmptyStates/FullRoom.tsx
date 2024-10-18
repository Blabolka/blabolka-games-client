import React from 'react'

import RoomImage from '@assets/img/resources/room-icon.svg'

const FullRoom = () => {
    return (
        <div className="container center-page">
            <div className="column">
                <img src={RoomImage} alt="Room is full image" className="empty-state-image" />
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
