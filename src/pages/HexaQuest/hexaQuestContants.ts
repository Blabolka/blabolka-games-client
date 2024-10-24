import {
    HexType,
    MoveType,
    TeamType,
    HexConfig,
    PlayerType,
    AttackConfig,
    HexesConfigItem,
    PlayerConfigItem,
    PlayerViewDirections,
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
                numberOfHealthPoints: NUMBER_OF_HEALTH_POINTS_BY_PLAYER[type],
                remainingMoveCost: NUMBER_OF_TILES_PER_TURN_BY_PLAYER[type],
                remainingActions: NUMBER_OF_ACTIONS_PER_TURN_BY_PLAYER[type],
                remainingHealthPoints: NUMBER_OF_HEALTH_POINTS_BY_PLAYER[type],
            },
        }
    }
    const FRIEND_TEAM_PLAYERS = [
        {
            coordinates: { q: 0, r: 0 },
            config: {
                type: PlayerType.WARRIOR,
                team: TeamType.BLUE,
                lastViewDirection: PlayerViewDirections.RIGHT,
            },
        },
        {
            coordinates: { q: 0, r: 1 },
            config: {
                type: PlayerType.ARCHER,
                team: TeamType.BLUE,
                lastViewDirection: PlayerViewDirections.RIGHT,
            },
        },
    ]
    const ENEMY_TEAM_PLAYERS = [
        {
            coordinates: { q: 14, r: 0 },
            config: {
                type: PlayerType.WARRIOR,
                team: TeamType.RED,
                lastViewDirection: PlayerViewDirections.LEFT,
            },
        },
        {
            coordinates: { q: 14, r: -1 },
            config: {
                type: PlayerType.ARCHER,
                team: TeamType.RED,
                lastViewDirection: PlayerViewDirections.LEFT,
            },
        },
    ]

    const maxLength = Math.max(FRIEND_TEAM_PLAYERS.length, ENEMY_TEAM_PLAYERS.length)
    return Array.from({ length: maxLength })
        .flatMap((_, i) => [FRIEND_TEAM_PLAYERS[i], ENEMY_TEAM_PLAYERS[i]].filter(Boolean))
        .map(getUpdatedPlayerConfig)
}

export const NUMBER_OF_TILES_PER_TURN_BY_PLAYER = {
    [PlayerType.WARRIOR]: 4,
    [PlayerType.ARCHER]: 3,
}

export const NUMBER_OF_ACTIONS_PER_TURN_BY_PLAYER = {
    [PlayerType.WARRIOR]: 1,
    [PlayerType.ARCHER]: 1,
}

export const NUMBER_OF_HEALTH_POINTS_BY_PLAYER = {
    [PlayerType.WARRIOR]: 30,
    [PlayerType.ARCHER]: 20,
}

export const MOVE_COST_BY_PLAYER_AND_HEX_TYPE = {
    [PlayerType.WARRIOR]: {
        [HexType.DEFAULT]: 1,
        [HexType.BUSH]: 2,
        [HexType.FOREST]: Infinity,
        [HexType.WATER]: Infinity,
    },
    [PlayerType.ARCHER]: {
        [HexType.DEFAULT]: 1,
        [HexType.BUSH]: 2,
        [HexType.FOREST]: 3,
        [HexType.WATER]: Infinity,
    },
}

export const ATTACK_CONFIG_BY_PLAYER: Record<string, Record<string, AttackConfig>> = {
    [PlayerType.WARRIOR]: {
        [MoveType.MELEE_ATTACK]: {
            range: 1,
            damage: 10,
        },
    },
    [PlayerType.ARCHER]: {
        [MoveType.MELEE_ATTACK]: {
            range: 1,
            damage: 7,
        },
        [MoveType.RANGE_ATTACK]: {
            range: 5,
            damage: 5,
            offset: 1,
        },
    },
}

export const DEFAULT_HEX_CONFIG: HexConfig = {
    type: HexType.DEFAULT,
}

// export const HEXES_CONFIG: HexesConfigItem[] = [
//     { coordinates: { q: 2, r: 4 }, config: { type: HexType.BUSH } },
//     { coordinates: { q: 5, r: 0 }, config: { type: HexType.FOREST } },
//     { coordinates: { q: 6, r: 3 }, config: { type: HexType.WATER } },
//     { coordinates: { q: 6, r: 0 }, config: { type: HexType.FOREST } },
//     { coordinates: { q: 7, r: -1 }, config: { type: HexType.FOREST } },
//     { coordinates: { q: 7, r: 2 }, config: { type: HexType.WATER } },
//     { coordinates: { q: 8, r: 1 }, config: { type: HexType.WATER } },
//     { coordinates: { q: 9, r: 0 }, config: { type: HexType.WATER } },
//     { coordinates: { q: 11, r: -3 }, config: { type: HexType.BUSH } },
// ]

export const HEXES_CONFIG: HexesConfigItem[] = [
    { coordinates: { q: 2, r: 4 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 5, r: 0 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 6, r: 3 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 6, r: 0 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 7, r: -1 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 7, r: 2 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 8, r: 1 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 9, r: 0 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 11, r: -3 }, config: { type: HexType.FOREST } },
]

export const PLAYERS_CONFIG: PlayerConfigItem[] = createPlayersConfig()
