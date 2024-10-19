import { TeamType } from '@entityTypes/hexaQuest'

export const getTeamBorderColorByType = (teamType: TeamType) => {
    switch (teamType) {
        case TeamType.RED:
            return 'red'
        case TeamType.BLUE:
            return 'blue'
    }
}
