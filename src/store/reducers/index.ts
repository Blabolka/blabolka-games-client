import { combineReducers } from 'redux'

import ticTacToeReducer from './ticTacToeReducer'
import modalWindowReducer from './modalWindowReducer'

const rootReducer = combineReducers({
    ticTacToe: ticTacToeReducer,
    modalWindow: modalWindowReducer,
})

export default rootReducer
