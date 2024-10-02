import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@hooks'
import { setIsGridDisabled, setTicTacToeCell, setRestartGame } from '@redux-actions'
import {
    getTicTacToeGrid,
    getTicTacToePlayer,
    getTicTacToeIsGridDisabled,
    getTicTacToeValuesInRowToFinish,
} from '@redux-selectors'
import { CellFullData, CellValuesEnum } from '@entityTypes/ticTacToe'
import { TicTacToeFinishGameChecker } from '@services/ticTacToe/TicTacToeFinishGameChecker'

import socket from '@lib/socket'

import CloseIcon from '@assets/img/close-icon.svg'
import CircleIcon from '@assets/img/circle-icon.svg'

type TicTacToeCellProps = {
    ticTacToeCell: CellFullData
}

import { TicTacToeActionsEnum } from '@entityTypes/socket'

const TicTacToeCell = ({ ticTacToeCell }: TicTacToeCellProps) => {
    const [isCellOnHover, setIsCellOnHover] = useState(false)

    const player = useAppSelector(getTicTacToePlayer)
    const ticTacToeGrid = useAppSelector(getTicTacToeGrid)
    const isGridDisabled = useAppSelector(getTicTacToeIsGridDisabled)
    const valuesInRowToFinish = useAppSelector(getTicTacToeValuesInRowToFinish)

    const dispatch = useAppDispatch()

    const onCellClick = () => {
        if (!isGridDisabled && !ticTacToeCell.cellData.isClicked) {
            dispatch(setIsGridDisabled(true))

            const newCellData = {
                ...ticTacToeCell,
                cellData: {
                    isClicked: true,
                    value: player.value,
                },
            }

            dispatch(setTicTacToeCell(newCellData))
            socket.emit(TicTacToeActionsEnum.PLAYER_MADE_MOVE_FROM_CLIENT, newCellData)
        }
    }

    const onMouseEnterImageHover = () => {
        if (!isGridDisabled) {
            setIsCellOnHover(true)
        }
    }

    const onMouseLeaveImageHover = () => {
        setIsCellOnHover(false)
    }

    useEffect(() => {
        if (ticTacToeCell.cellData.isClicked) {
            const finishGameChecker = new TicTacToeFinishGameChecker(ticTacToeGrid, ticTacToeCell, valuesInRowToFinish)
            const isGameFinished = finishGameChecker.checkFinishGame()
            if (isGameFinished) {
                dispatch(setIsGridDisabled(true))
                dispatch(
                    setRestartGame({
                        isOpen: true,
                        isButtonClicked: false,
                        message: 'Do you want to play again?',
                    }),
                )
            }
        }
    }, [ticTacToeCell.cellData.isClicked])

    useEffect(() => {
        setIsCellOnHover(false)
    }, [ticTacToeGrid])

    return (
        <button
            className="tic-tac-toe-grid__cell"
            onClick={onCellClick}
            onMouseEnter={onMouseEnterImageHover}
            onMouseLeave={onMouseLeaveImageHover}
        >
            {ticTacToeCell.cellData.isClicked ? (
                <img
                    src={ticTacToeCell.cellData.value === CellValuesEnum.X ? CloseIcon : CircleIcon}
                    alt={`Tic-Tac-Toe Icon`}
                    draggable={false}
                />
            ) : (
                isCellOnHover && (
                    <img
                        style={{ opacity: '0.2' }}
                        src={player.value === CellValuesEnum.X ? CloseIcon : CircleIcon}
                        alt={`Tic-Tac-Toe Hover Icon`}
                        draggable={false}
                    />
                )
            )}
        </button>
    )
}

export default TicTacToeCell
