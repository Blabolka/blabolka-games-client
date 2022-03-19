import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '@hooks'
import {
    setTicTacToePlayer,
    setTicTacToeGrid,
    setTicTacToeCell,
    setIsGridDisabled,
    setRestartGame,
} from '@redux-actions/ticTacToeActions'

import { getTicTacToeArray } from '@utils/ticTacToe'
import GameInfoPanel from '@components/GameInfoPanel'
import TicTacToeGrid from '@components/TicTacToe/TicTacToeGrid'
import RoomFull from '@components/EmptyStates/RoomFull'
import WaitForPlayers from '@components/InfoPanelComponents/WaitForPlayers'
import RestartGame from '@components/InfoPanelComponents/RestartGame'

import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'

import { TicTacToeActionsEnum } from '@entityTypes/socket'
import { TicTacToePlayer } from '@entityTypes/ticTacToePlayer'

import socket from '@socket'

const TicTacToe = () => {
    const dispatch = useAppDispatch()
    const isOpenRestartGame = useAppSelector((state) => state.ticTacToe.restartGame.isOpen)
    const { roomId } = useParams()

    const [isLoading, setIsLoading] = useState(true)
    const [snackBar, setSnackBar] = useState({ open: false, message: '' })
    const [isWaitingForPlayers, setIsWaitingForPlayers] = useState(false)
    const [isRoomFull, setIsRoomFull] = useState(false)

    const onOpponentLeave = () => {
        setSnackBar({ open: false, message: '' })
    }

    useEffect(() => {
        socket.on(TicTacToeActionsEnum.ROOM_IS_FULL_FROM_SERVER, () => {
            setIsRoomFull(true)
            setIsLoading(false)
        })

        socket.on(TicTacToeActionsEnum.WAIT_MORE_PLAYERS_FROM_SERVER, () => {
            setIsWaitingForPlayers(true)
            setIsLoading(false)
            dispatch(setIsGridDisabled(true))
            dispatch(setTicTacToeGrid(getTicTacToeArray(3, 3)))
            dispatch(setTicTacToePlayer(null))
        })

        socket.on(TicTacToeActionsEnum.GAME_WAS_STARTED_FROM_SERVER, (player: TicTacToePlayer) => {
            setIsWaitingForPlayers(false)
            setIsLoading(false)
            dispatch(setRestartGame({ isOpen: false, isButtonClicked: false, message: '' }))
            dispatch(setIsGridDisabled(!player.isTurnToStartGame))
            dispatch(setTicTacToeGrid(getTicTacToeArray(3, 3)))
            dispatch(setTicTacToePlayer(player))

            if (player.isTurnToStartGame) {
                setSnackBar({ open: true, message: 'Вы ходите первыми' })
            } else {
                setSnackBar({ open: true, message: 'Оппонент ходит первым' })
            }
        })

        socket.on(TicTacToeActionsEnum.PLAYER_LEAVE_GAME_FROM_SERVER, () => {
            dispatch(setRestartGame({ isOpen: false, isButtonClicked: false, message: '' }))
            setSnackBar({ open: true, message: 'Оппонент покинул игру' })
            setIsWaitingForPlayers(true)
            dispatch(setIsGridDisabled(true))
            dispatch(setTicTacToeGrid(getTicTacToeArray(3, 3)))
            dispatch(setTicTacToePlayer(null))
        })

        socket.on(TicTacToeActionsEnum.PLAYER_MADE_MOVE_FROM_SERVER, (cellData) => {
            dispatch(setTicTacToeCell(cellData))
            dispatch(setIsGridDisabled(false))
        })

        socket.emit(TicTacToeActionsEnum.PLAYER_JOIN_ROOM_FROM_CLIENT, { roomId, gameKey: 'tic-tac-toe' })
    }, [])

    return (
        <>
            {isLoading ? (
                <div className="center-page-absolute">
                    <CircularProgress color="inherit" />
                </div>
            ) : isRoomFull ? (
                <RoomFull />
            ) : (
                <>
                    <GameInfoPanel>
                        {isWaitingForPlayers && <WaitForPlayers />}
                        {isOpenRestartGame && <RestartGame />}
                    </GameInfoPanel>
                    <TicTacToeGrid />
                </>
            )}

            <Snackbar
                open={snackBar.open}
                onClose={onOpponentLeave}
                autoHideDuration={4000}
                message={snackBar.message}
            />
        </>
    )
}

export default TicTacToe
