import React from 'react'

import Button from '@mui/material/Button'

import { MoveType, RenderDataProps } from '@entityTypes/hexaQuest'
import { getAttackConfigByPlayerAndType } from '../hexaQuestHelpers'

export type HexaQuestGUIProps = RenderDataProps & {
    onPlayerMoveCancel: () => void
    onPlayerFinishMove: () => void
    onPlayerAttackStart: (moveType: MoveType) => void
}

const HexaQuestGUI = ({
    currentPlayer,
    playerMoveState,
    onPlayerAttackStart,
    onPlayerMoveCancel,
    onPlayerFinishMove,
}: HexaQuestGUIProps) => {
    return (
        <div className="column gap-4 hexa-quest__gui">
            <span>Remaining actions: {currentPlayer?.config?.remainingActions}</span>
            <span>Remaining moves: {currentPlayer?.config?.remainingMoveCost}</span>
            {getAttackConfigByPlayerAndType(currentPlayer?.config.type, MoveType.MELEE_ATTACK) ? (
                <Button
                    size="small"
                    color="inherit"
                    disabled={!currentPlayer?.config?.remainingActions}
                    variant={playerMoveState.moveType === MoveType.MELEE_ATTACK ? 'outlined' : 'contained'}
                    onClick={
                        playerMoveState.moveType === MoveType.MELEE_ATTACK
                            ? onPlayerMoveCancel
                            : () => onPlayerAttackStart(MoveType.MELEE_ATTACK)
                    }
                >
                    {playerMoveState.moveType === MoveType.MELEE_ATTACK ? 'Cancel attack' : 'Melee attack'}
                </Button>
            ) : null}
            {getAttackConfigByPlayerAndType(currentPlayer?.config.type, MoveType.RANGE_ATTACK) ? (
                <Button
                    size="small"
                    color="inherit"
                    disabled={!currentPlayer?.config?.remainingActions}
                    variant={playerMoveState.moveType === MoveType.RANGE_ATTACK ? 'outlined' : 'contained'}
                    onClick={
                        playerMoveState.moveType === MoveType.RANGE_ATTACK
                            ? onPlayerMoveCancel
                            : () => onPlayerAttackStart(MoveType.RANGE_ATTACK)
                    }
                >
                    {playerMoveState.moveType === MoveType.RANGE_ATTACK ? 'Cancel attack' : 'Range attack'}
                </Button>
            ) : null}
            <Button variant="contained" color="inherit" size="small" onClick={onPlayerFinishMove}>
                End turn
            </Button>
        </div>
    )
}

export default HexaQuestGUI
