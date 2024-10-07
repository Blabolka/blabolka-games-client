import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import serverApi from '@api/serverApi'

import { ModalBasicProps } from '@entityTypes/modals'
import { CreateRoomInfo, RoomTypesEnum } from '@entityTypes/room'
import { TicTacToeGridSizeKeysEnum } from '@entityTypes/ticTacToe'
import { getValuesInRowToFinishByGridSizeKey } from '@utils/ticTacToe'

import LoadingButton from '@mui/lab/LoadingButton'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
    Box,
    Modal,
    Button,
    Select,
    MenuItem,
    Checkbox,
    TextField,
    InputLabel,
    IconButton,
    FormControl,
    FormControlLabel,
} from '@mui/material'

import './TicTacToeCreateRoom.less'

const TicTacToeCreateRoom = ({ onClose }: ModalBasicProps) => {
    const navigate = useNavigate()

    const inputPasswordRef = useRef({ value: '' })
    const [isPrivate, setIsPrivate] = useState(false)
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [buttonIsLoading, setButtonIsLoading] = useState(false)
    const [validation, setValidation] = useState({ isPasswordError: false, passwordErrorMessage: '' })
    const [gridSizeSelectValue, setGridSizeSelectValue] = useState(TicTacToeGridSizeKeysEnum.THREE_BY_THREE)

    const onGridSizeSelectChange = (element) => {
        setGridSizeSelectValue(element.target.value)
    }

    const onCheckboxChange = (element) => {
        setIsPrivate(element.target.checked)
        if (validation.isPasswordError) {
            setValidation({ isPasswordError: false, passwordErrorMessage: '' })
        }
    }

    const onShowPasswordToggle = () => {
        setIsShowPassword(!isShowPassword)
    }

    const onPasswordInputChange = () => {
        if (validation.isPasswordError) {
            setValidation({ isPasswordError: false, passwordErrorMessage: '' })
        }
    }

    const onModalClose = () => {
        if (!buttonIsLoading) {
            onClose()
        }
    }

    const onCreateRoomButtonClick = async () => {
        setButtonIsLoading(true)
        const roomInfo: CreateRoomInfo = {
            roomType: RoomTypesEnum.TIC_TAC_TOE,
            roomInfo: {
                gridSize: gridSizeSelectValue,
                valuesInRowToFinish: getValuesInRowToFinishByGridSizeKey(gridSizeSelectValue),
            },
            isPrivate: isPrivate,
        }

        if (isPrivate) {
            if (inputPasswordRef.current.value) {
                roomInfo.password = inputPasswordRef.current.value
                createRoom(roomInfo)
            } else {
                setValidation({ isPasswordError: true, passwordErrorMessage: 'Password cannot be empty' })
                setButtonIsLoading(false)
            }
        } else {
            createRoom(roomInfo)
        }
    }

    const createRoom = async (roomInfo: CreateRoomInfo) => {
        const roomFullInfo = await serverApi.createRoom(roomInfo)

        setButtonIsLoading(false)
        onModalClose()

        navigate(`/tic-tac-toe/${roomFullInfo.data.roomId}`)
    }

    return (
        <Modal open={true} onClose={onModalClose}>
            <div className="modal-window__wrapper">
                <div className="modal-window">
                    <div className="modal-window__header font-size-20px text-title-color">Tic-Tac-Toe Room</div>
                    <div className="modal-window__body">
                        <Box sx={{ paddingBottom: '10px' }}>
                            <FormControl size="small">
                                <InputLabel id="grid-size-select-label">Grid size</InputLabel>
                                <Select
                                    defaultValue={TicTacToeGridSizeKeysEnum.THREE_BY_THREE}
                                    labelId="grid-size-select-label"
                                    label="Grid size"
                                    onChange={onGridSizeSelectChange}
                                >
                                    <MenuItem value={TicTacToeGridSizeKeysEnum.THREE_BY_THREE}>
                                        {TicTacToeGridSizeKeysEnum.THREE_BY_THREE}
                                    </MenuItem>

                                    <MenuItem value={TicTacToeGridSizeKeysEnum.FIVE_BY_FIVE}>
                                        {TicTacToeGridSizeKeysEnum.FIVE_BY_FIVE}
                                    </MenuItem>

                                    <MenuItem value={TicTacToeGridSizeKeysEnum.SEVEN_BY_SEVEN}>
                                        {TicTacToeGridSizeKeysEnum.SEVEN_BY_SEVEN}
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
                                type={isShowPassword ? 'text' : 'password'}
                                label={validation.isPasswordError ? validation.passwordErrorMessage : 'Password'}
                                error={validation.isPasswordError}
                                variant="outlined"
                                size="small"
                                onChange={onPasswordInputChange}
                                inputRef={inputPasswordRef}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton size="small" disabled={!isPrivate} onClick={onShowPasswordToggle}>
                                            {isShowPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    ),
                                }}
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
                            onClick={onCreateRoomButtonClick}
                        >
                            Create Room
                        </LoadingButton>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default TicTacToeCreateRoom
