import { combineReducers } from 'redux'

import hexaQuestReducer from './hexaQuestReducer'
import ticTacToeReducer from './ticTacToeReducer'
import modalWindowReducer from './modalWindowReducer'

const rootReducer = combineReducers({
    hexaQuest: hexaQuestReducer,
    ticTacToe: ticTacToeReducer,
    modalWindow: modalWindowReducer,
})

export default rootReducer
