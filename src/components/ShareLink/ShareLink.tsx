import React, { useState } from 'react'

import copy from 'copy-to-clipboard'

import { Chip } from '@mui/material'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { ContentCopy, CheckCircle } from '@mui/icons-material'

const ShareLink = () => {
    const [isIconHidden, setIsIconHidden] = useState(true)
    const [isCopied, setIsCopied] = useState(false)
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)

    const onCopyInviteLinkClick = () => {
        setIsCopied(true)
        setIsSnackbarOpen(true)
        copy(window.location.href)
    }

    const onCopyLinkMouseEnter = () => {
        setIsIconHidden(false)
    }

    const onCopyLinkMouseLeave = () => {
        setIsIconHidden(true)
        setTimeout(() => {
            setIsCopied(false)
        }, 150)
    }

    const onSnackbarClose = () => {
        setIsSnackbarOpen(false)
    }

    return (
        <>
            <div
                className="column align-center gap-5px"
                onMouseEnter={onCopyLinkMouseEnter}
                onMouseLeave={onCopyLinkMouseLeave}
            >
                <span className="font-size-16px">Copy invite link</span>
                <Chip
                    sx={{ fontSize: 'clamp(10px, 3.9vw, 20px)' }}
                    label={window.location.href}
                    variant="outlined"
                    color={!isCopied ? 'default' : 'success'}
                    onDelete={onCopyInviteLinkClick}
                    onClick={onCopyInviteLinkClick}
                    deleteIcon={
                        !isCopied ? (
                            <ContentCopy sx={!isIconHidden ? { opacity: '1' } : { opacity: '0' }} />
                        ) : (
                            <CheckCircle sx={!isIconHidden ? { opacity: '1' } : { opacity: '0' }} />
                        )
                    }
                />
            </div>
            <Snackbar
                open={isSnackbarOpen}
                onClose={onSnackbarClose}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={onSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Copied!
                </Alert>
            </Snackbar>
        </>
    )
}

export default ShareLink
