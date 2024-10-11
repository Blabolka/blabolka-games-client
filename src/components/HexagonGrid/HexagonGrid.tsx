import React from 'react'

type AdditionalHexagonGridProps = {
    width?: number
    height?: number
}

export type HexagonGridProps = AdditionalHexagonGridProps & React.SVGProps<SVGSVGElement>

const HexagonGrid = ({ width, height, children, ...props }: HexagonGridProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width={width}
            height={height}
            overflow="visible"
            {...(width && height ? { viewBox: `0 0 ${width} ${height}` } : {})}
            {...props}
        >
            {children}
        </svg>
    )
}

export default HexagonGrid
