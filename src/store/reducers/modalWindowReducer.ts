import { ModalWindowTypes } from '../types'
import { ModalWindowProps } from '@entityTypes/modals'

const initialState: ModalWindowProps = {
    modalType: '',
    modalProps: {},
}

const modalWindowReducer = (state = initialState, action) => {
    switch (action.type) {
        case ModalWindowTypes.SET_MODAL_WINDOW: {
            return { ...state, ...action.payload }
        }
        default:
            return state
    }
}

export default modalWindowReducer
