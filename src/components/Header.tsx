import React from 'react'
import { Link } from 'react-router-dom'

import './Header.less'

import controllerLogo from '@assets/img/controller-logo-icon.svg'

const Header = () => {
    return (
        <header className="header__wrapper">
            <div className="header">
                <Link className="header__logo" to="/">
                    <img className="header__logo-icon" src={controllerLogo} alt="Controller Logo" />
                    <div className="header__logo-title font-weight-extra-bold font-size-22px">
                        Blabolka<span>Games</span>
                    </div>
                </Link>
            </div>
        </header>
    )
}

export default Header
