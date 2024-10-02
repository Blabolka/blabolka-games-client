export type ModalWindowProps = {
    modalType: string
    modalProps?: any
}

export type ModalBasicProps = {
    onClose: () => void
    modalProps?: any
}

export enum ModalTypesEnum {
    TIC_TAC_TOE_CREATE_ROOM = 'tic-tac-toe-create-room',
}
