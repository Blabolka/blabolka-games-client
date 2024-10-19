import { Hex, TeamType } from '@entityTypes/hexaQuest'

export const calculateTeamMarkerPoints = (hex: Hex) => {
    const triangleSizeFactor = 0.2

    const triangleHeight = hex.height * triangleSizeFactor
    const triangleWidth = hex.width * triangleSizeFactor

    const bottomPointX = hex.x
    const bottomPointY = hex.y - hex.height / 2

    const leftPointX = hex.x - triangleWidth / 2
    const leftPointY = hex.y - hex.height / 2 - triangleHeight

    const rightPointX = hex.x + triangleWidth / 2
    const rightPointY = hex.y - hex.height / 2 - triangleHeight

    return `${bottomPointX},${bottomPointY} ${leftPointX},${leftPointY} ${rightPointX},${rightPointY}`
}

export const getTeamBorderColorByType = (teamType: TeamType) => {
    switch (teamType) {
        case TeamType.RED:
            return 'red'
        case TeamType.BLUE:
            return 'blue'
    }
}
