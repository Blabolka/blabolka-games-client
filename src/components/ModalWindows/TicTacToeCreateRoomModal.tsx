import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@hooks'
import { setModalWindow } from '@redux-actions/modalWindowActions'

import { TicTacToeGridSizes } from '@entityTypes/ticTacToe'

import './TicTacToeCreateRoomModal.less'

import { makeStyles } from '@mui/styles'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import LoadingButton from '@mui/lab/LoadingButton'
import FormControl from '@mui/material/FormControl'

const useStyles = makeStyles({
    // Select styles
    inputLabel: {
        '&.Mui-focused': {
            color: '#3c988e',
        },
    },
    select: {
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
})

const TicTacToeCreateRoomModal = () => {
    const dispatch = useAppDispatch()
    const modalWindow = useAppSelector((state) => state.modalWindow)

    const classes = useStyles()

    const [gridSizeSelectValue, setGridSizeSelectValue] = useState(TicTacToeGridSizes.THREE_BY_THREE)

    const onGridSizeSelectChange = (element) => {
        setGridSizeSelectValue(element.target.value)
    }

    const onModalClose = () => {
        dispatch(setModalWindow({ ...modalWindow, isOpen: false }))
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
                        <FormControl size="small">
                            <InputLabel className={classes.inputLabel} id="grid-size-select-label">
                                Grid size
                            </InputLabel>
                            <Select
                                defaultValue={TicTacToeGridSizes.THREE_BY_THREE}
                                labelId="grid-size-select-label"
                                label="Grid size"
                                onChange={onGridSizeSelectChange}
                                className={classes.select}
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
                    </div>
                    <div className="modal-window__actions">
                        <Button sx={{ color: '#3c988e' }} color="inherit" onClick={onModalClose}>
                            Close
                        </Button>
                        <LoadingButton
                            sx={{
                                backgroundColor: '#3c988e',
                                color: '#ffffff',
                                '&:hover': { backgroundColor: '#348a81' },
                            }}
                            color="inherit"
                            variant="contained"
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
