import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '@hooks'
import {
    setTicTacToePlayer,
    setTicTacToeGrid,
    setTicTacToeCell,
    setValuesInRowToFinish,
    setIsGridDisabled,
    setRestartGame,
} from '@redux-actions/ticTacToeActions'

import { getRoomById } from '@api'

import { getTicTacToeArray, getGridSizeByGridSizeKey } from '@utils/ticTacToe'
import GameInfoPanel from '@components/GameInfoPanel'
import TicTacToeGrid from '@components/TicTacToe/TicTacToeGrid'
import RoomFull from '@components/EmptyStates/RoomFull'
import WaitForPlayers from '@components/InfoPanelComponents/WaitForPlayers'
import RestartGame from '@components/InfoPanelComponents/RestartGame'

import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'

import { RoomTypesEnum, RoomFullInfo } from '@entityTypes/room'
import { TicTacToeActionsEnum } from '@entityTypes/socket'
import { TicTacToeGridSize } from '@entityTypes/ticTacToe'
import { TicTacToePlayer } from '@entityTypes/ticTacToePlayer'

import socket from '@socket'

const TicTacToe = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { roomId } = useParams()

    const [isLoading, setIsLoading] = useState(true)
    const isOpenRestartGame = useAppSelector((state) => state.ticTacToe.restartGame.isOpen)
    const [isWaitingForPlayers, setIsWaitingForPlayers] = useState(false)

    const [isRoomFull, setIsRoomFull] = useState(false)
    const [snackBar, setSnackBar] = useState({ open: false, message: '' })

    const initSocketListeners = (room: RoomFullInfo) => {
        socket.connect()
        const ticTacToeGridSize: TicTacToeGridSize = getGridSizeByGridSizeKey(room.roomInfo.gridSize)
        dispatch(setValuesInRowToFinish(room.roomInfo.valuesInRowToFinish))

        socket.on(TicTacToeActionsEnum.ROOM_IS_FULL_FROM_SERVER, () => {
            setIsRoomFull(true)
            setIsLoading(false)
        })

        socket.on(TicTacToeActionsEnum.WAIT_MORE_PLAYERS_FROM_SERVER, () => {
            setIsWaitingForPlayers(true)
            setIsLoading(false)
            dispatch(setIsGridDisabled(true))
            dispatch(setTicTacToeGrid(getTicTacToeArray(ticTacToeGridSize.rowCount, ticTacToeGridSize.columnCount)))
            dispatch(setTicTacToePlayer(null))
        })

        socket.on(TicTacToeActionsEnum.GAME_WAS_STARTED_FROM_SERVER, (player: TicTacToePlayer) => {
            setIsWaitingForPlayers(false)
            setIsLoading(false)
            dispatch(setRestartGame({ isOpen: false, isButtonClicked: false, message: '' }))
            dispatch(setIsGridDisabled(!player.isTurnToStartGame))
            dispatch(setTicTacToeGrid(getTicTacToeArray(ticTacToeGridSize.rowCount, ticTacToeGridSize.columnCount)))
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
            dispatch(setTicTacToeGrid(getTicTacToeArray(ticTacToeGridSize.rowCount, ticTacToeGridSize.columnCount)))
            dispatch(setTicTacToePlayer(null))
        })

        socket.on(TicTacToeActionsEnum.PLAYER_MADE_MOVE_FROM_SERVER, (cellData) => {
            dispatch(setTicTacToeCell(cellData))
            dispatch(setIsGridDisabled(false))
        })

        socket.emit(TicTacToeActionsEnum.PLAYER_JOIN_ROOM_FROM_CLIENT, { roomId, gameKey: RoomTypesEnum.TIC_TAC_TOE })
    }

    const onOpponentLeave = () => {
        setSnackBar({ open: false, message: '' })
    }

    useEffect(() => {
        const fetchRoomData = async () => {
            const roomInfo = await getRoomById(roomId || '')

            if (roomInfo.data) {
                initSocketListeners(roomInfo.data)
            } else {
                navigate('/')
            }
        }

        fetchRoomData().then()

        return () => {
            socket.removeAllListeners()
            socket.disconnect()
        }
    }, [])

    return (
        <>
            {isLoading ? (
                <div className="center-page">
                    <CircularProgress color="inherit" />
                </div>
            ) : isRoomFull ? (
                <RoomFull />
            ) : (
                <div className="center-page">
                    <GameInfoPanel>
                        {isWaitingForPlayers && <WaitForPlayers />}
                        {isOpenRestartGame && <RestartGame />}
                    </GameInfoPanel>
                    <TicTacToeGrid />
                </div>
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
