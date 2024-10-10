import { defineHex, Grid, rectangle } from 'honeycomb-grid'
import {
    GamePlayerMoveState,
    Hex,
    HexConfig,
    HexesConfigItem,
    HexType,
    PlayerConfigItem,
    PlayerType,
    TeamType,
} from '@entityTypes/hexaQuest'

const MOVE_COST_BY_PLAYER_AND_HEX_TYPE = {
    [PlayerType.WARRIOR]: {
        [HexType.DEFAULT]: 1,
        [HexType.FOREST]: 2,
        [HexType.WATER]: 3,
        [HexType.IMPASSABLE]: Infinity,
    },
}

const DEFAULT_HEX_CONFIG: HexConfig = {
    type: HexType.DEFAULT,
}

const HEXES_CONFIG: HexesConfigItem[] = [
    { coordinates: { q: 1, r: 4 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 2, r: 4 }, config: { type: HexType.FOREST } },
    { coordinates: { q: 0, r: 7 }, config: { type: HexType.WATER } },
    { coordinates: { q: 1, r: 7 }, config: { type: HexType.WATER } },
    { coordinates: { q: 2, r: 7 }, config: { type: HexType.WATER } },
    { coordinates: { q: 3, r: 7 }, config: { type: HexType.WATER } },
]

const PLAYERS_CONFIG: PlayerConfigItem[] = [
    { coordinates: { q: 0, r: 0 }, config: { type: PlayerType.WARRIOR, team: TeamType.FRIEND } },
    { coordinates: { q: 5, r: 9 }, config: { type: PlayerType.WARRIOR, team: TeamType.ENEMY } },
]

export const getConfigByHex = (config: HexesConfigItem[], hex: Hex) => {
    const configItem = config.find(({ coordinates }) => hex.q === coordinates.q && hex.r === coordinates.r)
    return configItem?.config || DEFAULT_HEX_CONFIG
}

export const getMoveCostByPlayerAndType = (player?: PlayerType, type?: HexType) => {
    const costsByPlayer = player ? MOVE_COST_BY_PLAYER_AND_HEX_TYPE[player] : null
    const costByType = type && costsByPlayer ? costsByPlayer[type] : 0
    return costByType || MOVE_COST_BY_PLAYER_AND_HEX_TYPE[HexType.DEFAULT]
}

export const updateGridWithMoveCosts = (grid: Grid<Hex>, playerType: PlayerType) => {
    grid.forEach((hex: Hex) => {
        hex.config = {
            ...hex.config,
            moveCost: getMoveCostByPlayerAndType(playerType, hex.config?.type),
        }
    })
}

export const getInitialPlayerMoveState = (): GamePlayerMoveState => ({ path: [] })

export const getInitialGameConfig = (): { grid: Grid<Hex>; players: PlayerConfigItem[] } => {
    const Tile = defineHex({ dimensions: 40, origin: 'topLeft' })
    const grid = new Grid(Tile, rectangle({ width: 10, height: 10 })).forEach((hex: Hex) => {
        hex.config = getConfigByHex(HEXES_CONFIG, hex)
    })

    return { grid, players: PLAYERS_CONFIG }
}
