export enum TicTacToeTypes {
    SET_TIC_TAC_TOE = 'ticTacToe/set',
    SET_PLAYER = 'ticTacToe/setPlayer',
    SET_TIC_TAC_TOE_GRID = 'ticTacToe/setTicTacToeGrid',
    SET_TIC_TAC_TOE_CELL = 'ticTacToe/setTicTacToeCell',
    SET_TIC_TAC_TOE_VALUES_IN_ROW_TO_FINISH = 'ticTacToe/setTicTacToeValuesInRowToFinish',
    SET_IS_GRID_DISABLED = 'ticTacToe/setIsGridDisabled',
    SET_IS_RESTART_BUTTON_HIDE = 'ticTacToe/setIsRestartButtonHide',
}

export enum HexaQuestTypes {
    UPDATE_PLAYERS_GAME_STATE = 'hexaQuest/updatePlayersGameState',
    UPDATE_PLAYER_MOVE_STATE = 'hexaQuest/updatePlayerMoveState',
    RESET_PLAYER_MOVE_STATE = 'hexaQuest/resetPlayerMoveState',
}

export enum ModalWindowTypes {
    SET_MODAL_WINDOW = 'modalWindow/setModalWindow',
}
