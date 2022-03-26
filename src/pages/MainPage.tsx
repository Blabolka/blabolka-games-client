import React from 'react'
import { useAppDispatch } from '@hooks'
import { setModalWindow } from '@redux-actions/modalWindowActions'

import TicTacToeCreateRoomModal from '@components/ModalWindows/TicTacToeCreateRoomModal'

import ticTacToeImage from '@assets/img/tic-tac-toe-preview.svg'

import './MainPage.less'

const MainPage = () => {
    const dispatch = useAppDispatch()

    const onTicTacToeGameClick = () => {
        dispatch(setModalWindow({ isOpen: true }))
    }

    return (
        <>
            <div className="center-page">
                <button className="game-preview__wrapper" onClick={onTicTacToeGameClick}>
                    <div className="game-preview column align-center">
                        <img
                            src={ticTacToeImage}
                            alt="Tic-Tac-Toe previewImage"
                            className="game-preview__image"
                            draggable={false}
                        />
                        <span className="game-preview__title font-size-20px font-weight-bold">TIC-TAC-TOE</span>
                    </div>
                </button>
            </div>

            <TicTacToeCreateRoomModal />
        </>
    )
}

export default MainPage
