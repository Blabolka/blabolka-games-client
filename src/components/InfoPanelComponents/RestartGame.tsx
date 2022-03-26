import React from 'react'
import Button from '@mui/material/Button'
import { useAppSelector, useAppDispatch } from '@hooks'

import { setRestartGame } from '@redux-actions/ticTacToeActions'

import { TicTacToeActionsEnum } from '@entityTypes/socket'

import socket from '@socket'

const RestartGame = () => {
    const dispatch = useAppDispatch()
    const player = useAppSelector((state) => state.ticTacToe.player)
    const restartGame = useAppSelector((state) => state.ticTacToe.restartGame)

    const onRestartButtonClick = () => {
        dispatch(setRestartGame({ isOpen: true, isButtonClicked: true, message: 'Waiting for opponent...' }))
        socket.emit(TicTacToeActionsEnum.PLAYER_WANT_PLAY_AGAIN_FROM_CLIENT, player)
    }

    return (
        <Button
            variant="outlined"
            color="inherit"
            size="small"
            disabled={restartGame.isButtonClicked}
            onClick={onRestartButtonClick}
        >
            {restartGame.message}
        </Button>
    )
}

export default RestartGame
