import { HexConfig, HexesConfigItem, HexType, PlayerConfigItem, PlayerType, TeamType } from '@entityTypes/hexaQuest'

export const MOVE_COST_BY_PLAYER_AND_HEX_TYPE = {
    [PlayerType.WARRIOR]: {
        [HexType.DEFAULT]: 1,
        [HexType.BUSH]: 1,
        [HexType.FOREST]: 2,
        [HexType.WATER]: 3,
        [HexType.IMPASSABLE]: Infinity,
    },
}

export const MELEE_ATTACK_RANGE_BY_PLAYER = {
    [PlayerType.WARRIOR]: 1,
}

export const NUMBER_OF_TILES_PER_TURN_BY_PLAYER = {
    [PlayerType.WARRIOR]: 5,
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

export const PLAYERS_CONFIG: PlayerConfigItem[] = [
    {
        coordinates: { q: 0, r: 0 },
        config: {
            type: PlayerType.WARRIOR,
            team: TeamType.FRIEND,
            numberOfMoveCostPerTurn: NUMBER_OF_TILES_PER_TURN_BY_PLAYER[PlayerType.WARRIOR],
            remainingMoveCost: NUMBER_OF_TILES_PER_TURN_BY_PLAYER[PlayerType.WARRIOR],
        },
    },
    {
        coordinates: { q: 15, r: 0 },
        config: {
            type: PlayerType.WARRIOR,
            team: TeamType.ENEMY,
            numberOfMoveCostPerTurn: NUMBER_OF_TILES_PER_TURN_BY_PLAYER[PlayerType.WARRIOR],
            remainingMoveCost: NUMBER_OF_TILES_PER_TURN_BY_PLAYER[PlayerType.WARRIOR],
        },
    },
]
