import React from 'react'

export type HexagonGridProps = React.SVGProps<SVGSVGElement>

const HexagonGrid = ({ children, ...props }: HexagonGridProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" overflow="visible" {...props}>
            {children}
        </svg>
    )
}

export default HexagonGrid
