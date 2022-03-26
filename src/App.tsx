import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from '@components/Header'
import BodyWrapper from '@components/BodyWrapper'
import Loading from '@components/Loading'

const MainPage = React.lazy(() => import('@pages/MainPage'))
const TicTacToe = React.lazy(() => import('@pages/TicTacToe'))

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <BodyWrapper>
                <React.Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/:roomId" element={<TicTacToe />} />
                    </Routes>
                </React.Suspense>
            </BodyWrapper>
        </BrowserRouter>
    )
}

export default App
