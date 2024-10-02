import React from 'react'
import TicTacToeCell from '../Cell/TicTacToeCell'

import { CellFullData } from '@entityTypes/ticTacToe'

type TicTacToeRowProps = {
    ticTacToeRow: CellFullData[]
}

const TicTacToeRow = ({ ticTacToeRow }: TicTacToeRowProps) => {
    return (
        <div className="tic-tac-toe-grid__row">
            {ticTacToeRow.map((ticTacToeCell, index) => {
                return <TicTacToeCell key={index} ticTacToeCell={ticTacToeCell} />
            })}
        </div>
    )
}

export default TicTacToeRow
