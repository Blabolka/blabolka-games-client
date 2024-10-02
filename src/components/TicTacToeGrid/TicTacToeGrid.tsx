import React from 'react'
import { useAppSelector } from '@hooks'
import { getTicTacToeGrid } from '@redux-selectors'

import TicTacToeRow from './Row/TicTacToeRow'

import './TicTacToeGrid.less'

const TicTacToeGrid = () => {
    const ticTacToeGrid = useAppSelector(getTicTacToeGrid)

    return (
        <div className="tic-tac-toe-grid__wrapper">
            <div className="tic-tac-toe-grid">
                {ticTacToeGrid.map((ticTacToeRow, index) => {
                    return <TicTacToeRow key={index} ticTacToeRow={ticTacToeRow} />
                })}
            </div>
        </div>
    )
}

export default TicTacToeGrid
