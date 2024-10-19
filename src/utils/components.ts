export enum StrokeWidthFactorType {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
    XLARGE = 'xlarge',
}

export const getStrokeWidthFactorByType = (factorType: StrokeWidthFactorType) => {
    switch (factorType) {
        case StrokeWidthFactorType.SMALL:
            return 0.03
        case StrokeWidthFactorType.MEDIUM:
            return 0.05
        case StrokeWidthFactorType.LARGE:
            return 0.07
        case StrokeWidthFactorType.XLARGE:
            return 0.1
    }
}

export const calculateAdaptiveSvgStrokeWidth = (
    sizeOfBlock: number = 0,
    factorType: StrokeWidthFactorType = StrokeWidthFactorType.MEDIUM,
) => {
    const strokeWidthFactor = getStrokeWidthFactorByType(factorType)
    return sizeOfBlock * strokeWidthFactor
}
