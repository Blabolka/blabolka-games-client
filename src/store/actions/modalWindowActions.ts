import { ModalWindowTypes } from '../types'
import { ModalWindowProps } from '@entityTypes/modalWindowProps'

export const setModalWindow = (state: ModalWindowProps) => ({
    type: ModalWindowTypes.SET_MODAL_WINDOW,
    payload: state,
})
