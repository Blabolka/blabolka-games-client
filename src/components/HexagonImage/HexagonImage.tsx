import React from 'react'

type AdditionalHexagonImageProps = {
    image: string
    width: number
    height: number
    x: number
    y: number
}

export type HexagonImageProps = AdditionalHexagonImageProps & React.SVGProps<SVGImageElement>

const HexagonImage = ({ image, width, height, x, y, ...props }: HexagonImageProps) => {
    return (
        <image
            xlinkHref={image}
            x={x}
            y={y}
            width={width}
            height={height}
            pointerEvents="none"
            preserveAspectRatio="none"
            {...props}
        />
    )
}

export default HexagonImage
