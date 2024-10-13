import { defineHex, Grid, Orientation, rectangle, spiral } from 'honeycomb-grid'
import hexagonPathfinding from '@services/hexagon/hexagonPathfinding'
import {
    HEXES_CONFIG,
    PLAYERS_CONFIG,
    DEFAULT_HEX_CONFIG,
    ATTACK_CONFIG_BY_PLAYER,
    MOVE_COST_BY_PLAYER_AND_HEX_TYPE,
} from './hexaQuestContants'
import {
    Hex,
    HexType,
    MoveType,
    PlayerType,
    Coordinates,
    HexesConfigItem,
    PlayerConfigItem,
    GamePlayerMoveState,
    HexagonRendererState,
    HexagonRendererDataProps,
} from '@entityTypes/hexaQuest'

export const getConfigByHex = (config: HexesConfigItem[], hex: Hex) => {
    const configItem = config.find(({ coordinates }) => hex.equals(coordinates))
    return configItem?.config || DEFAULT_HEX_CONFIG
}

export const getMoveCostByPlayerAndType = (playerType?: PlayerType, hexType?: HexType) => {
    const costsByPlayer = playerType ? MOVE_COST_BY_PLAYER_AND_HEX_TYPE[playerType] : null
    const costByType = hexType && costsByPlayer ? costsByPlayer[hexType] : 0
    return costByType || MOVE_COST_BY_PLAYER_AND_HEX_TYPE[HexType.DEFAULT]
}

export const getAttackConfigByPlayerAndType = (playerType?: PlayerType, attackType?: MoveType) => {
    const configByPlayer = playerType ? ATTACK_CONFIG_BY_PLAYER[playerType] : null
    return configByPlayer && attackType ? configByPlayer[attackType] : undefined
}

export const sumPathMoveCost = (path?: Hex[]) => {
    const trimmedPath = path?.slice(1) || [] // because first element always start element
    if (!trimmedPath.length) return 0

    return trimmedPath.reduce((memo, hex) => memo + (hex?.config?.moveCost || 0), 0) || Infinity
}

export const getPlayerByCoordinates = (players: PlayerConfigItem[], destination: Coordinates) => {
    return players.find((player) => {
        return destination.q === player.coordinates.q && destination.r === player.coordinates.r
    })
}

export const getGridWithUpdatedMoveCosts = (grid: Grid<Hex>, playerType: PlayerType, players: PlayerConfigItem[]) => {
    return grid.map((hex) => {
        const newHex = hex.clone() as Hex

        const player = getPlayerByCoordinates(players, hex)

        const moveCostByHexType = getMoveCostByPlayerAndType(playerType, hex.config?.type)
        const moveCostByPlayerOnHex = player ? Infinity : 0

        newHex.config = {
            ...hex.config,
            moveCost: Math.max(moveCostByHexType, moveCostByPlayerOnHex),
        }

        return newHex
    })
}

export const getAvailableHexesToMove = (grid: Grid<Hex>, players: PlayerConfigItem[], player?: PlayerConfigItem) => {
    if (!player) return []

    const updatedGrid = getGridWithUpdatedMoveCosts(grid, player.config.type, players)
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
        const playerOnHex = getPlayerByCoordinates(players, hex)

        const pathToHex = hexagonPathfinding.aStar(updatedGrid, startHexagon, hex)
        const moveCostsSum = sumPathMoveCost(pathToHex)

        const isFilteredByPathCost = moveCostsSum > player.config.remainingMoveCost
        const isFilteredBySomePlayerOnHex = !!playerOnHex

        return !(isFilteredByPathCost || isFilteredBySomePlayerOnHex)
    })
}

export const getAvailableHexesToAttack = (grid: Grid<Hex>, player?: PlayerConfigItem, attackType?: MoveType) => {
    if (!player || !attackType) return []

    const startHexagon = grid.getHex({ q: player.coordinates.q, r: player.coordinates.r })
    if (!startHexagon) return []

    const attackConfig = getAttackConfigByPlayerAndType(player.config.type, attackType)
    if (!attackConfig) return []

    const hexes = grid
        .traverse(
            spiral({
                start: startHexagon,
                radius: attackConfig.range,
            }),
        )
        .toArray()

    return hexes.filter((hex) => !hex.equals(startHexagon))
}

export const getPathToMove = (
    grid: Grid<Hex>,
    currentPlayer: PlayerConfigItem,
    players: PlayerConfigItem[],
    destination: Hex,
) => {
    const updatedGrid = getGridWithUpdatedMoveCosts(grid, currentPlayer.config.type, players)

    const startHexagon = updatedGrid.getHex({ q: currentPlayer.coordinates.q, r: currentPlayer.coordinates.r })
    const goalHexagon = updatedGrid.getHex({ q: destination.q, r: destination.r })

    return startHexagon && goalHexagon ? hexagonPathfinding.aStar(updatedGrid, startHexagon, goalHexagon) || [] : []
}

export const getPathToAttack = (grid: Grid<Hex>, currentPlayer: PlayerConfigItem, destination: Hex) => {
    const startHexagon = grid.getHex({ q: currentPlayer.coordinates.q, r: currentPlayer.coordinates.r })
    const goalHexagon = grid.getHex({ q: destination.q, r: destination.r })

    return startHexagon && goalHexagon ? [startHexagon, goalHexagon] : []
}

export const getInitialPlayerMoveState = (): GamePlayerMoveState => ({
    moveType: MoveType.MOVE,
    path: [],
    availableHexesToMove: [],
})

export const getInitialGameConfig = (): { grid: Grid<Hex>; players: PlayerConfigItem[] } => {
    const Tile = defineHex({ dimensions: 40, origin: 'topLeft', orientation: Orientation.FLAT })
    const grid = new Grid(Tile, rectangle({ width: 16, height: 8 })).forEach((hex: Hex) => {
        hex.config = getConfigByHex(HEXES_CONFIG, hex)
    })

    return { grid, players: PLAYERS_CONFIG }
}

export const getHexagonRendererState = ({
    hex,
    currentPlayer,
    playerMoveState,
    playersGameState,
}: HexagonRendererDataProps): HexagonRendererState => {
    const player = getPlayerByCoordinates(playersGameState.players, hex)

    return {
        hex,
        player,
        currentPlayer,
        playerMoveState,
        playersGameState,
        isCurrentPlayer:
            player?.coordinates?.q === currentPlayer?.coordinates?.q &&
            player?.coordinates?.r === currentPlayer?.coordinates?.r,
        isFriendPlayer: currentPlayer?.config.team === player?.config.team,
        isEnemyPlayer: currentPlayer?.config.team !== player?.config.team,
        isHexAccessibleByPlayer: playerMoveState.availableHexesToMove.some(
            (availableHex) => availableHex.q === hex.q && availableHex.r === hex.r,
        ),
    }
}
