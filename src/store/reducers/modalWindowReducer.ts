import { ModalWindowTypes } from '../types'
import { ModalWindowProps } from '@entityTypes/modalWindowProps'

const initialState: ModalWindowProps = {
    isOpen: false,
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
