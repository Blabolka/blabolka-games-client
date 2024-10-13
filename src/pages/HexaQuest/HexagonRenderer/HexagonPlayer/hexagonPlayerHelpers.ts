import { PlayerType, TeamType } from '@entityTypes/hexaQuest'

export const getPlayerTextByType = (playerType: PlayerType) => {
    switch (playerType) {
        case PlayerType.WARRIOR: {
            return 'Warrior'
        }
        case PlayerType.ARCHER: {
            return 'Archer'
        }
    }
}

export const getPlayerColorByType = (teamType: TeamType) => {
    switch (teamType) {
        case TeamType.FRIEND: {
            return 'blue'
        }
        case TeamType.ENEMY: {
            return 'red'
        }
    }
}