import React from 'react'

import { Hex } from 'honeycomb-grid'

export type HexagonProps = {
    hex: Hex
    svgProps?: any
    polygonProps?: any
    children?: React.ReactNode
}

const Hexagon = (props: HexagonProps) => {
    const { hex, polygonProps = {} } = props

    const minXPoint = Math.min(...hex.corners.map((point) => point.x))
    const minYPoint = Math.min(...hex.corners.map((point) => point.y))

    const updatedCorners = hex.corners.map(({ x, y }) => ({ x: x - minXPoint, y: y - minYPoint }))

    const xCornerPoints = updatedCorners.map((point) => point.x)
    const yCornerPoints = updatedCorners.map((point) => point.y)

    const minXPointUpdated = Math.min(...xCornerPoints)
    const maxXPointUpdated = Math.max(...xCornerPoints)
    const minYPointUpdated = Math.min(...yCornerPoints)
    const maxYPointUpdated = Math.max(...yCornerPoints)

    const viewBox = [
        Math.abs(minXPointUpdated),
        Math.abs(minYPointUpdated),
        Math.abs(maxXPointUpdated),
        Math.abs(maxYPointUpdated),
    ].join(' ')

    const polygon = (
        <polygon
            points={updatedCorners.map(({ x, y }) => `${x},${y}`).join(' ')}
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2"
            {...polygonProps}
        />
    )

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox={viewBox}
            width={hex.width}
            height={hex.height}
            overflow="visible"
            {...props?.svgProps}
        >
            {polygon}
            {props.children}
        </svg>
    )
}

export default Hexagon
