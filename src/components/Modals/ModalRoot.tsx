import React from 'react'
import { useAppDispatch, useAppSelector } from '@hooks'
import { setModalWindow } from '@redux-actions'
import { getModalWindow } from '@redux-selectors'

import TicTacToeCreateRoom from './TicTacToeCreateRoom/TicTacToeCreateRoom'

import { ModalTypesEnum } from '@entityTypes/modals'

const MODALS_BY_TYPE = {
    [ModalTypesEnum.TIC_TAC_TOE_CREATE_ROOM]: TicTacToeCreateRoom,
}

const ModalRoot = () => {
    const dispatch = useAppDispatch()
    const modalWindow = useAppSelector(getModalWindow)

    const SpecificModal = !!modalWindow.modalType ? MODALS_BY_TYPE[modalWindow.modalType] : null

    const onClose = () => {
        dispatch(setModalWindow({ modalType: '', modalProps: {} }))
    }

    const defaultModalProps = {
        onClose,
        modalProps: modalWindow.modalProps || {},
    }

    return SpecificModal ? <SpecificModal {...defaultModalProps} /> : null
}

export default ModalRoot
