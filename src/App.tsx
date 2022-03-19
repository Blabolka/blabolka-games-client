import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from '@components/Header/Header'
import BodyWrapper from '@components/Body/BodyWrapper'

import MainPage from '@pages/MainPage'
import TicTacToe from '@pages/TicTacToe'

import '@socket'

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <BodyWrapper>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/:roomId" element={<TicTacToe />} />
                </Routes>
            </BodyWrapper>
        </BrowserRouter>
    )
}

export default App
