import React, { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@hooks'
import { setModalWindow } from '@redux-actions/modalWindowActions'

import { TicTacToeGridSizes } from '@entityTypes/ticTacToe'

import './TicTacToeCreateRoomModal.less'

import {
    Box,
    Modal,
    Button,
    Select,
    MenuItem,
    Checkbox,
    TextField,
    InputLabel,
    FormControl,
    FormControlLabel,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

const TicTacToeCreateRoomModal = () => {
    const dispatch = useAppDispatch()
    const modalWindow = useAppSelector((state) => state.modalWindow)

    const [buttonIsLoading, setButtonIsLoading] = useState(false)
    const [gridSizeSelectValue, setGridSizeSelectValue] = useState(TicTacToeGridSizes.THREE_BY_THREE)
    const [isPrivate, setIsPrivate] = useState(false)
    const inputPasswordRef = useRef({ value: '' })

    const onGridSizeSelectChange = (element) => {
        setGridSizeSelectValue(element.target.value)
    }

    const onCheckboxChange = (element) => {
        setIsPrivate(element.target.checked)
    }

    const onModalClose = () => {
        if (!buttonIsLoading) {
            dispatch(setModalWindow({ ...modalWindow, isOpen: false }))
            setGridSizeSelectValue(TicTacToeGridSizes.THREE_BY_THREE)
            setIsPrivate(false)
        }
    }

    const onLoadingButtonClick = () => {
        setButtonIsLoading(true)
    }

    return (
        <Modal open={modalWindow.isOpen} onClose={onModalClose}>
            <div className="modal-window__wrapper">
                <div className="modal-window">
                    <div className="modal-window__header font-size-20px text-title-color">Tic-Tac-Toe Room</div>
                    <div className="modal-window__body">
                        <Box sx={{ paddingBottom: '10px' }}>
                            <FormControl size="small">
                                <InputLabel id="grid-size-select-label">Grid size</InputLabel>
                                <Select
                                    defaultValue={TicTacToeGridSizes.THREE_BY_THREE}
                                    labelId="grid-size-select-label"
                                    label="Grid size"
                                    onChange={onGridSizeSelectChange}
                                >
                                    <MenuItem value={TicTacToeGridSizes.THREE_BY_THREE}>
                                        {TicTacToeGridSizes.THREE_BY_THREE}
                                    </MenuItem>

                                    <MenuItem value={TicTacToeGridSizes.FIVE_BY_FIVE}>
                                        {TicTacToeGridSizes.FIVE_BY_FIVE}
                                    </MenuItem>

                                    <MenuItem value={TicTacToeGridSizes.SEVEN_BY_SEVEN}>
                                        {TicTacToeGridSizes.SEVEN_BY_SEVEN}
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                checked={isPrivate}
                                onChange={onCheckboxChange}
                                value="end"
                                control={<Checkbox size="small" />}
                                label="Private Room"
                                labelPlacement="end"
                                sx={{ fontSize: '14px', marginLeft: '8px' }}
                            />
                        </Box>

                        <FormControl fullWidth>
                            <TextField
                                disabled={!isPrivate}
                                type="password"
                                label="Password"
                                variant="outlined"
                                size="small"
                                inputRef={inputPasswordRef}
                            />
                        </FormControl>
                    </div>
                    <div className="modal-window__actions">
                        <Button color="inherit" onClick={onModalClose}>
                            Close
                        </Button>
                        <LoadingButton
                            loading={buttonIsLoading}
                            color="inherit"
                            variant="contained"
                            onClick={onLoadingButtonClick}
                        >
                            Create Room
                        </LoadingButton>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default TicTacToeCreateRoomModal
