import React from 'react'

import roomImage from '@assets/img/room-icon.svg'

const RoomFull = () => {
    return (
        <div className="center-page">
            <div className="column">
                <img src={roomImage} alt="Room is full image" />
                <div className="column text-align-center">
                    <span className="font-size-20px font-weight-medium">Комната полная</span>
                    <span className="font-size-14px">Поищите другую комнату или создайте свою</span>
                </div>
            </div>
        </div>
    )
}

export default RoomFull
