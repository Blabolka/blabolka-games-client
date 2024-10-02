import React from 'react'
import Button from '@mui/material/Button'
import { useAppSelector, useAppDispatch } from '@hooks'
import { setRestartGame } from '@redux-actions'
import { getTicTacToePlayer, getTicTacToeRestart } from '@redux-selectors'

import socket from '@lib/socket'

import { TicTacToeActionsEnum } from '@entityTypes/socket'

const TicTacToeRestartGame = () => {
    const dispatch = useAppDispatch()
    const player = useAppSelector(getTicTacToePlayer)
    const restartGame = useAppSelector(getTicTacToeRestart)

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

export default TicTacToeRestartGame
