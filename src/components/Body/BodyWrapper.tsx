import React, { ReactNode } from 'react'

import './BodyWrapper.less'

type BodyProps = {
    children: ReactNode
}

const BodyWrapper = ({ children }: BodyProps) => {
    return <div className="body__wrapper">{children}</div>
}

export default BodyWrapper
