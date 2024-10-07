import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from '@components/Header/Header'
import PageLoading from '@components/PageLoading/PageLoading'
import BodyWrapper from '@components/BodyWrapper/BodyWrapper'

const MainPage = React.lazy(() => import('@pages/MainPage/MainPage'))
const TicTacToe = React.lazy(() => import('@pages/TicTacToe/TicTacToe'))
const HexaQuest = React.lazy(() => import('@pages/HexaQuest/HexaQuest'))

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <BodyWrapper>
                <React.Suspense fallback={<PageLoading />}>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/tic-tac-toe/:roomId" element={<TicTacToe />} />
                        <Route path="/hexa-quest" element={<HexaQuest />} />
                    </Routes>
                </React.Suspense>
            </BodyWrapper>
        </BrowserRouter>
    )
}

export default App
