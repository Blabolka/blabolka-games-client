import React from 'react'
import { useAppDispatch } from '@hooks'
import { setModalWindow } from '@redux-actions'

import ModalRoot from '@components/Modals/ModalRoot'

import TicTacToeImage from '@assets/img/tic-tac-toe-preview.svg'

import { ModalTypesEnum } from '@entityTypes/modals'

import './MainPage.less'

const MainPage = () => {
    const dispatch = useAppDispatch()

    const onTicTacToeGameClick = (modalType: string) => {
        dispatch(setModalWindow({ modalType }))
    }

    return (
        <>
            <div className="center-page">
                <button
                    className="game-preview__wrapper"
                    onClick={() => onTicTacToeGameClick(ModalTypesEnum.TIC_TAC_TOE_CREATE_ROOM)}
                >
                    <div className="game-preview column align-center">
                        <img
                            src={TicTacToeImage}
                            alt="Tic-Tac-Toe previewImage"
                            className="game-preview__image"
                            draggable={false}
                        />
                        <span className="game-preview__title font-size-20px font-weight-bold">TIC-TAC-TOE</span>
                    </div>
                </button>
            </div>

            <ModalRoot />
        </>
    )
}

export default MainPage
