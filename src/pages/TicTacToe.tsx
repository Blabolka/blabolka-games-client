import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@hooks'
import {
    setIsGridDisabled,
    setRestartGame,
    setTicTacToe,
    setTicTacToeCell,
    setTicTacToeGrid,
    setTicTacToePlayer,
    setValuesInRowToFinish,
} from '@redux-actions/ticTacToeActions'

import { getRoomById } from '@api'

import { getGridSizeByGridSizeKey, getTicTacToeArray, getTicTacToeInitialState } from '@utils/ticTacToe'

import GameInfoPanel from '@components/GameInfoPanel'
import TicTacToeGrid from '@components/TicTacToe/TicTacToeGrid'
import FullRoom from '@components/EmptyStates/FullRoom'
import PrivateRoom from '@components/EmptyStates/PrivateRoom'
import RestartGame from '@components/InfoPanelComponents/RestartGame'
import ShareLinkPanel from '@components/InfoPanelComponents/ShareLinkPanel'
import WaitForPlayers from '@components/InfoPanelComponents/WaitForPlayers'

import Loading from '@components/Loading'
import Snackbar from '@mui/material/Snackbar'

import { RoomTypesEnum, TicTacToeRoomParams } from '@entityTypes/room'
import { TicTacToeActionsEnum } from '@entityTypes/socket'
import { TicTacToeGridSize, TicTacToeGridSizeKeysEnum } from '@entityTypes/ticTacToe'
import { TicTacToePlayer } from '@entityTypes/ticTacToePlayer'

import socket from '@socket'

const TicTacToe = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { roomId } = useParams()
    const [ticTacToeRoomInfo, setTicTacToeRoomInfo] = useState<TicTacToeRoomParams>({
        gridSize: TicTacToeGridSizeKeysEnum.THREE_BY_THREE,
        valuesInRowToFinish: 3,
    })

    const [isLoading, setIsLoading] = useState(true)
    const isOpenRestartGame = useAppSelector((state) => state.ticTacToe.restartGame.isOpen)
    const [isWaitingForPlayers, setIsWaitingForPlayers] = useState(false)

    const [isRoomFull, setIsRoomFull] = useState(false)
    const [isRoomPrivate, setIsRoomPrivate] = useState(false)
    const [snackBar, setSnackBar] = useState({ open: false, message: '' })

    const initSocketListeners = (roomInfo: TicTacToeRoomParams) => {
        socket.connect()
        const ticTacToeGridSize: TicTacToeGridSize = getGridSizeByGridSizeKey(roomInfo.gridSize)
        dispatch(setValuesInRowToFinish(roomInfo.valuesInRowToFinish))

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
                setSnackBar({ open: true, message: 'You go first' })
            } else {
                setSnackBar({ open: true, message: 'Opponent go first' })
            }
        })

        socket.on(TicTacToeActionsEnum.PLAYER_LEAVE_GAME_FROM_SERVER, () => {
            dispatch(setRestartGame({ isOpen: false, isButtonClicked: false, message: '' }))
            setSnackBar({ open: true, message: 'Opponent left the game' })
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

    const onPasswordValidationCallback = () => {
        setIsRoomPrivate(false)
        setIsLoading(true)
        initSocketListeners(ticTacToeRoomInfo)
    }

    const onSnackbarClose = () => {
        setSnackBar({ open: false, message: '' })
    }

    useEffect(() => {
        const fetchRoomData = async () => {
            const roomResponse = await getRoomById(roomId || '')

            if (roomResponse.data) {
                setTicTacToeRoomInfo(roomResponse.data.roomInfo)
                const numberOfParticipants = roomResponse.data.numberOfParticipants

                if (numberOfParticipants === 0) {
                    initSocketListeners(roomResponse.data.roomInfo)
                } else if (numberOfParticipants === 2) {
                    setIsRoomFull(true)
                    setIsLoading(false)
                } else {
                    if (roomResponse.data.isPrivate) {
                        setIsRoomPrivate(true)
                        setIsLoading(false)
                    } else {
                        initSocketListeners(roomResponse.data.roomInfo)
                    }
                }
            } else {
                navigate('/')
            }
        }

        fetchRoomData().then()

        return () => {
            dispatch(setTicTacToe(getTicTacToeInitialState()))
            socket.removeAllListeners()
            socket.disconnect()
        }
    }, [])

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : isRoomPrivate ? (
                <PrivateRoom roomId={roomId || ''} passwordValidationCallback={onPasswordValidationCallback} />
            ) : isRoomFull ? (
                <FullRoom />
            ) : (
                <div className="center-page">
                    <GameInfoPanel styles={{ height: '70px' }}>
                        {isWaitingForPlayers && <ShareLinkPanel />}
                        {isOpenRestartGame && <RestartGame />}
                    </GameInfoPanel>

                    <TicTacToeGrid />

                    <GameInfoPanel styles={{ height: '40px' }}>
                        {isWaitingForPlayers && <WaitForPlayers />}
                    </GameInfoPanel>
                </div>
            )}

            <Snackbar
                open={snackBar.open}
                onClose={onSnackbarClose}
                autoHideDuration={4000}
                message={snackBar.message}
            />
        </>
    )
}

export default TicTacToe
