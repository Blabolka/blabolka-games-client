import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@hooks'
import { setModalWindow } from '@redux-actions'

import ModalRoot from '@components/Modals/ModalRoot'

import TicTacToeImage from '@assets/img/tic-tac-toe-preview.svg'

import { ModalTypesEnum } from '@entityTypes/modals'

import './MainPage.less'

const MainPage = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const GAMES = [
        {
            name: 'TIC-TAC-TOE',
            image: TicTacToeImage,
            onClick: () => dispatch(setModalWindow({ modalType: ModalTypesEnum.TIC_TAC_TOE_CREATE_ROOM })),
        },
        {
            name: 'HEXA-QUEST',
            image: TicTacToeImage,
            onClick: () => navigate('/hexa-quest'),
        },
    ]

    return (
        <>
            <div className="container center-page">
                <div className="row align-center justify-center flex-wrap gap-64">
                    {GAMES.map(({ name, image, onClick }, index) => (
                        <button key={index} onClick={onClick} className="game-preview__wrapper">
                            <div className="game-preview column align-center">
                                <img
                                    src={image}
                                    draggable={false}
                                    alt={`${name} previewImage`}
                                    className="game-preview__image"
                                />
                                <span className="game-preview__title font-size-20px font-weight-bold">{name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <ModalRoot />
        </>
    )
}

export default MainPage
