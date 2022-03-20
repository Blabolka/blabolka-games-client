import React from 'react'
import { useAppDispatch } from '@hooks'
import { setModalWindow } from '@redux-actions/modalWindowActions'

import Button from '@mui/material/Button'

import TicTacToeCreateRoomModal from '@components/ModalWindows/TicTacToeCreateRoomModal'

const MainPage = () => {
    const dispatch = useAppDispatch()

    const onButtonClick = () => {
        dispatch(setModalWindow({ isOpen: true }))
    }

    return (
        <>
            <Button variant="contained" onClick={onButtonClick}>
                TIC-TAC-TOE
            </Button>
            <TicTacToeCreateRoomModal />
        </>
    )
}

export default MainPage
