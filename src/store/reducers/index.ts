import { combineReducers } from 'redux'

import ticTacToeReducer from './ticTacToeReducer'

const rootReducer = combineReducers({
    ticTacToe: ticTacToeReducer,
})

export default rootReducer
