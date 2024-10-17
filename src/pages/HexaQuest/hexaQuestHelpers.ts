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

// hexagonPathfinding.runTesting()

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
    if (!trimmedPath.length) return Infinity

    return trimmedPath.reduce((memo, hex) => memo + (hex?.config?.moveCost || 0), 0) || Infinity
}

export const getPlayerByCoordinates = (players: PlayerConfigItem[], destination: Coordinates) => {
    return players.find((player) => {
        return destination.q === player.coordinates.q && destination.r === player.coordinates.r
    })
}

export const getPlayerMoveRangeGrid = (grid: Grid<Hex>, player) => {
    return grid.traverse(
        spiral({
            radius: player.config.remainingMoveCost,
            start: { q: player.coordinates.q, r: player.coordinates.r },
        }),
    )
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

    const playerRangeGrid = getPlayerMoveRangeGrid(grid, player)
    const updatedGrid = getGridWithUpdatedMoveCosts(playerRangeGrid, player.config.type, players)
    const startHexagon = updatedGrid.getHex({ q: player.coordinates.q, r: player.coordinates.r })

    if (!startHexagon) return []

    return updatedGrid.reduce<Hex[]>((memo, hex) => {
        const playerOnHex = getPlayerByCoordinates(players, hex)

        const { path: pathToHex } = hexagonPathfinding.aStar({ grid: updatedGrid, start: startHexagon, goal: hex })
        const moveCostsSum = sumPathMoveCost(pathToHex)

        const isFilteredByPathCost = moveCostsSum > player.config.remainingMoveCost
        const isFilteredBySomePlayerOnHex = !!playerOnHex

        return !(isFilteredByPathCost || isFilteredBySomePlayerOnHex) ? [...memo, hex] : memo
    }, [])
}

export const getAvailableHexesToAttack = (grid: Grid<Hex>, player?: PlayerConfigItem, attackType?: MoveType) => {
    if (!player || !attackType) return []

    const startHexagon = grid.getHex({ q: player.coordinates.q, r: player.coordinates.r })
    if (!startHexagon) return []

    const attackConfig = getAttackConfigByPlayerAndType(player.config.type, attackType)
    if (!attackConfig) return []

    const attackHexes = grid
        .traverse(
            spiral({
                start: startHexagon,
                radius: attackConfig.range,
            }),
        )
        .toArray()

    const attackOffsetHexes = attackConfig.offset
        ? grid
              .traverse(
                  spiral({
                      start: startHexagon,
                      radius: attackConfig.offset,
                  }),
              )
              .toArray()
        : []

    return attackHexes.filter(
        (hex) => !hex.equals(startHexagon) && !attackOffsetHexes.some((offsetHex) => hex.equals(offsetHex)),
    )
}

export const getPathToMove = (grid: Grid<Hex>, players: PlayerConfigItem[], player: PlayerConfigItem, goal: Hex) => {
    const playerRangeGrid = getPlayerMoveRangeGrid(grid, player)
    const updatedGrid = getGridWithUpdatedMoveCosts(playerRangeGrid, player.config.type, players)

    const startHexagon = updatedGrid.getHex({ q: player.coordinates.q, r: player.coordinates.r })
    const goalHexagon = updatedGrid.getHex({ q: goal.q, r: goal.r })

    return startHexagon && goalHexagon
        ? hexagonPathfinding.aStar({
              grid: updatedGrid,
              start: startHexagon,
              goal: goalHexagon,
          }).path
        : []
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
    const grid = new Grid(Tile, rectangle({ width: 15, height: 8 })).forEach((hex: Hex) => {
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
    const player = getPlayerByCoordinates(playersGameState?.players || [], hex)

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
        isHexAccessibleByPlayer: playerMoveState?.availableHexesToMove?.some(
            (availableHex) => availableHex.q === hex.q && availableHex.r === hex.r,
        ),
    }
}
