import { defineHex, Grid, Orientation, rectangle, spiral } from 'honeycomb-grid'
import hexagonPathfinding from '@services/hexagon/hexagonPathfinding'
import {
    Hex,
    HexType,
    TeamType,
    HexConfig,
    PlayerType,
    HexesConfigItem,
    PlayerConfigItem,
    GamePlayerMoveState,
} from '@entityTypes/hexaQuest'

const MOVE_COST_BY_PLAYER_AND_HEX_TYPE = {
    [PlayerType.WARRIOR]: {
        [HexType.DEFAULT]: 1,
        [HexType.BUSH]: 1,
        [HexType.FOREST]: 2,
        [HexType.WATER]: 3,
        [HexType.IMPASSABLE]: Infinity,
    },
}

const NUMBER_OF_TILES_PER_TURN_BY_PLAYER = {
    [PlayerType.WARRIOR]: 5,
}

const DEFAULT_HEX_CONFIG: HexConfig = {
    type: HexType.DEFAULT,
}

const HEXES_CONFIG: HexesConfigItem[] = [
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

const PLAYERS_CONFIG: PlayerConfigItem[] = [
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

export const getConfigByHex = (config: HexesConfigItem[], hex: Hex) => {
    const configItem = config.find(({ coordinates }) => hex.q === coordinates.q && hex.r === coordinates.r)
    return configItem?.config || DEFAULT_HEX_CONFIG
}

export const getMoveCostByPlayerAndType = (playerType?: PlayerType, hexType?: HexType) => {
    const costsByPlayer = playerType ? MOVE_COST_BY_PLAYER_AND_HEX_TYPE[playerType] : null
    const costByType = hexType && costsByPlayer ? costsByPlayer[hexType] : 0
    return costByType || MOVE_COST_BY_PLAYER_AND_HEX_TYPE[HexType.DEFAULT]
}

export const sumPathMoveCost = (path?: Hex[]) => {
    const trimmedPath = path?.slice(1) || [] // because first element always start element
    if (!trimmedPath.length) return 0

    return trimmedPath.reduce((memo, hex) => memo + (hex?.config?.moveCost || 0), 0) || Infinity
}

export const getGridWithUpdatedMoveCosts = (grid: Grid<Hex>, playerType: PlayerType) => {
    return grid.map((hex) => {
        const newHex = hex.clone() as Hex
        newHex.config = {
            ...hex.config,
            moveCost: getMoveCostByPlayerAndType(playerType, hex.config?.type),
        }

        return newHex
    })
}

export const getAvailableHexesToMove = (grid: Grid<Hex>, player?: PlayerConfigItem) => {
    if (!player) return []

    const updatedGrid = getGridWithUpdatedMoveCosts(grid, player.config.type)
    const startHexagon = updatedGrid.getHex({ q: player.coordinates.q, r: player.coordinates.r })
    if (!startHexagon) return []

    const availableHexes = updatedGrid
        .traverse(
            spiral({
                radius: player.config.numberOfMoveCostPerTurn,
                start: { q: player.coordinates.q, r: player.coordinates.r },
            }),
        )
        .toArray()

    return availableHexes.filter((hex) => {
        const pathToHex = hexagonPathfinding.aStar(updatedGrid, startHexagon, hex)
        const moveCostsSum = sumPathMoveCost(pathToHex)

        return moveCostsSum <= player.config.remainingMoveCost
    })
}

export const getInitialPlayerMoveState = (): GamePlayerMoveState => ({ path: [], availableHexesToMove: [] })

export const getInitialGameConfig = (): { grid: Grid<Hex>; players: PlayerConfigItem[] } => {
    const Tile = defineHex({ dimensions: 40, origin: 'topLeft', orientation: Orientation.FLAT })
    const grid = new Grid(Tile, rectangle({ width: 16, height: 8 })).forEach((hex: Hex) => {
        hex.config = getConfigByHex(HEXES_CONFIG, hex)
    })

    return { grid, players: PLAYERS_CONFIG }
}
