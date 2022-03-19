import React from 'react'
import TicTacToeRow from './Row/TicTacToeRow'
import { useAppSelector } from '@hooks'

import './TicTacToeGrid.less'

const TicTacToeGrid = () => {
    const ticTacToeGrid = useAppSelector((state) => state.ticTacToe.ticTacToeGrid)

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
