import React, { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@hooks'
import { setModalWindow } from '@redux-actions/modalWindowActions'

import { TicTacToeGridSizes } from '@entityTypes/ticTacToe'

import './TicTacToeCreateRoomModal.less'

import { makeStyles } from '@mui/styles'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import LoadingButton from '@mui/lab/LoadingButton'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'

const useStyles = makeStyles({
    // Input styles
    inputLabel: {
        '&.Mui-focused': {
            color: '#3c988e',
        },
    },
    input: {
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3c988e',
        },
    },
    icon: {
        fill: '#3c988e',
    },

    // MenuItem styles
    menuItem: {
        '&.Mui-selected': {
            backgroundColor: 'rgba(60, 152, 142, 0.08)',
        },
        '&.Mui-selected:hover': {
            backgroundColor: 'rgba(60, 152, 142, 0.12)',
        },
    },

    // Checkbox
    checkbox: {
        '&.Mui-checked': {
            color: '#3c988e',
        },
    },

    textFieldInput: {
        '& label.Mui-focused': {
            color: '#3c988e',
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#3c988e',
            },
        },
    },
})

const TicTacToeCreateRoomModal = () => {
    const dispatch = useAppDispatch()
    const modalWindow = useAppSelector((state) => state.modalWindow)

    const classes = useStyles()

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
        <Modal
            open={modalWindow.isOpen}
            onClose={onModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="modal-window__wrapper">
                <div className="modal-window">
                    <div className="modal-window__header font-size-20px text-title-color">Tic-Tac-Toe Room</div>
                    <div className="modal-window__body">
                        <Box sx={{ paddingBottom: '10px' }}>
                            <FormControl size="small">
                                <InputLabel className={classes.inputLabel} id="grid-size-select-label">
                                    Grid size
                                </InputLabel>
                                <Select
                                    defaultValue={TicTacToeGridSizes.THREE_BY_THREE}
                                    labelId="grid-size-select-label"
                                    label="Grid size"
                                    onChange={onGridSizeSelectChange}
                                    className={classes.input}
                                    inputProps={{
                                        classes: {
                                            icon: classes.icon,
                                        },
                                    }}
                                >
                                    <MenuItem className={classes.menuItem} value={TicTacToeGridSizes.THREE_BY_THREE}>
                                        {TicTacToeGridSizes.THREE_BY_THREE}
                                    </MenuItem>

                                    <MenuItem className={classes.menuItem} value={TicTacToeGridSizes.FIVE_BY_FIVE}>
                                        {TicTacToeGridSizes.FIVE_BY_FIVE}
                                    </MenuItem>

                                    <MenuItem className={classes.menuItem} value={TicTacToeGridSizes.SEVEN_BY_SEVEN}>
                                        {TicTacToeGridSizes.SEVEN_BY_SEVEN}
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                checked={isPrivate}
                                onChange={onCheckboxChange}
                                value="end"
                                control={<Checkbox className={classes.checkbox} size="small" />}
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
                                className={classes.textFieldInput}
                            />
                        </FormControl>
                    </div>
                    <div className="modal-window__actions">
                        <Button sx={{ color: '#3c988e' }} color="inherit" onClick={onModalClose}>
                            Close
                        </Button>
                        <LoadingButton
                            loading={buttonIsLoading}
                            color="inherit"
                            variant="contained"
                            onClick={onLoadingButtonClick}
                            sx={{
                                backgroundColor: '#3c988e',
                                color: '#ffffff',
                                '&:hover': { backgroundColor: '#348a81' },
                            }}
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
