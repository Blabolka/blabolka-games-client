import {
    HexType,
    MoveType,
    TeamType,
    HexConfig,
    PlayerType,
    HexesConfigItem,
    PlayerConfigItem,
} from '@entityTypes/hexaQuest'

const createPlayersConfig = (): PlayerConfigItem[] => {
    const getUpdatedPlayerConfig = (player: any): PlayerConfigItem => {
        const type = player?.config?.type || PlayerType.WARRIOR

        return {
            ...player,
            config: {
                ...player.config,
                numberOfMoveCostPerTurn: NUMBER_OF_TILES_PER_TURN_BY_PLAYER[type],
                numberOfActionsPerTurn: NUMBER_OF_ACTIONS_PER_TURN_BY_PLAYER[type],
                remainingMoveCost: NUMBER_OF_TILES_PER_TURN_BY_PLAYER[type],
                remainingActions: NUMBER_OF_ACTIONS_PER_TURN_BY_PLAYER[type],
            },
        }
    }
    const FRIEND_TEAM_PLAYERS = [
        {
            coordinates: { q: 0, r: 0 },
            config: {
                type: PlayerType.WARRIOR,
                team: TeamType.FRIEND,
            },
        },
        {
            coordinates: { q: 0, r: 1 },
            config: {
                type: PlayerType.ARCHER,
                team: TeamType.FRIEND,
            },
        },
    ]
    const ENEMY_TEAM_PLAYERS = [
        {
            coordinates: { q: 15, r: 0 },
            config: {
                type: PlayerType.WARRIOR,
                team: TeamType.ENEMY,
            },
        },
    ]

    return [...FRIEND_TEAM_PLAYERS, ...ENEMY_TEAM_PLAYERS].map((player) => {
        return getUpdatedPlayerConfig(player)
    })
}

export const NUMBER_OF_TILES_PER_TURN_BY_PLAYER = {
    [PlayerType.WARRIOR]: 5,
    [PlayerType.ARCHER]: 3,
}

export const NUMBER_OF_ACTIONS_PER_TURN_BY_PLAYER = {
    [PlayerType.WARRIOR]: 1,
    [PlayerType.ARCHER]: 1,
}

export const MOVE_COST_BY_PLAYER_AND_HEX_TYPE = {
    [PlayerType.WARRIOR]: {
        [HexType.DEFAULT]: 1,
        [HexType.BUSH]: 1,
        [HexType.FOREST]: 2,
        [HexType.WATER]: 3,
    },
    [PlayerType.ARCHER]: {
        [HexType.DEFAULT]: 1,
        [HexType.BUSH]: 1,
        [HexType.FOREST]: 2,
        [HexType.WATER]: 3,
    },
}

export const ATTACK_RANGE_BY_PLAYER = {
    [PlayerType.WARRIOR]: {
        [MoveType.MELEE_ATTACK]: 1,
    },
    [PlayerType.ARCHER]: {
        [MoveType.MELEE_ATTACK]: 1,
        [MoveType.RANGE_ATTACK]: 20,
    },
}

export const DEFAULT_HEX_CONFIG: HexConfig = {
    type: HexType.DEFAULT,
}

export const HEXES_CONFIG: HexesConfigItem[] = [
    { coordinates: { q: 2, r: 4 }, config: { type: HexType.BUSH } },
    { coordinates: { q: 5, r: 0 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 6, r: 3 }, config: { type: HexType.WATER } },
    { coordinates: { q: 6, r: 0 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 7, r: -1 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 7, r: 2 }, config: { type: HexType.WATER } },
    { coordinates: { q: 8, r: 1 }, config: { type: HexType.WATER } },
    { coordinates: { q: 9, r: 0 }, config: { type: HexType.WATER } },
    { coordinates: { q: 11, r: -3 }, config: { type: HexType.BUSH } },
]

export const PLAYERS_CONFIG: PlayerConfigItem[] = createPlayersConfig()
