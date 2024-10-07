import React, { useRef, useState } from 'react'

import serverApi from '@api/serverApi'

import { LoadingButton } from '@mui/lab'
import { IconButton, TextField } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import LockedRoomImage from '@assets/img/private-room-icon.svg'

type PrivateRoomProps = {
    roomId: string
    passwordValidationCallback: () => void
}

const PrivateRoom = ({ roomId, passwordValidationCallback }: PrivateRoomProps) => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [validation, setValidation] = useState({ isPasswordError: false, passwordErrorMessage: '' })
    const inputPasswordRef = useRef({ value: '' })

    const [buttonIsLoading, setButtonIsLoading] = useState(false)

    const onShowPasswordToggle = () => {
        setIsShowPassword(!isShowPassword)
    }

    const onPasswordInputChange = () => {
        if (validation.isPasswordError) {
            setValidation({ isPasswordError: false, passwordErrorMessage: '' })
        }
    }

    const onEnterPrivateRoomClick = async () => {
        setButtonIsLoading(true)
        const loginResponse = await serverApi.loginRoom(roomId, inputPasswordRef.current.value)

        setButtonIsLoading(false)
        if (loginResponse.data) {
            passwordValidationCallback()
        } else {
            setValidation({ isPasswordError: true, passwordErrorMessage: 'Wrong password' })
        }
    }

    return (
        <div className="center-page">
            <div className="column align-center">
                <img src={LockedRoomImage} alt="Room is private image" className="empty-state-image" />
                <span className="font-size-20px font-weight-medium">This is a private room</span>
                <div className="row align-center gap-4" style={{ marginTop: '10px' }}>
                    <TextField
                        type={isShowPassword ? 'text' : 'password'}
                        label={validation.isPasswordError ? validation.passwordErrorMessage : 'Password'}
                        error={validation.isPasswordError}
                        variant="outlined"
                        size="small"
                        onChange={onPasswordInputChange}
                        inputRef={inputPasswordRef}
                        InputProps={{
                            endAdornment: (
                                <IconButton size="small" onClick={onShowPasswordToggle}>
                                    {isShowPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            ),
                        }}
                    />
                    <LoadingButton
                        loading={buttonIsLoading}
                        color="inherit"
                        variant="contained"
                        onClick={onEnterPrivateRoomClick}
                    >
                        Enter
                    </LoadingButton>
                </div>
            </div>
        </div>
    )
}

export default PrivateRoom
