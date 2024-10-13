import { Hex as HoneycombHex } from 'honeycomb-grid'

export type Coordinates = {
    q: number
    r: number
}

// Hex types
export enum HexType {
    DEFAULT = 'default',
    BUSH = 'bush',
    FOREST = 'forest',
    WATER = 'water',
}

export type HexConfig = {
    type?: HexType
    moveCost?: number
}

export type Hex = HoneycombHex & { config?: HexConfig }
export type HexesConfigItem = { coordinates: Coordinates; config: HexConfig }

// Team types
export enum TeamType {
    BLUE = 'blue',
    RED = 'red',
}

// Player types
export enum PlayerType {
    WARRIOR = 'warrior',
    ARCHER = 'archer',
}

export type PlayerConfig = {
    type: PlayerType
    team: TeamType
    numberOfMoveCostPerTurn: number
    numberOfActionsPerTurn: number
    numberOfHealthPoints: number
    remainingMoveCost: number
    remainingActions: number
    remainingHealthPoints: number
}

export type PlayerConfigItem = { coordinates: Coordinates; config: PlayerConfig }

// Attack types
export type AttackConfig = {
    range: number
    damage: number
}

// Game and move types
export enum MoveType {
    MOVE = 'move',
    MELEE_ATTACK = 'meleeAttack',
    RANGE_ATTACK = 'rangeAttack',
}

export type GamePlayerMoveState = {
    moveType: MoveType
    path: Hex[]
    availableHexesToMove: Hex[]
}

export type GamePlayersState = {
    players: PlayerConfigItem[]
    currentPlayerCoordinates?: Coordinates
}

// Hex renderer types
export type HexagonRendererDataProps = {
    hex: Hex
    currentPlayer?: PlayerConfigItem
    playersGameState: GamePlayersState
    playerMoveState: GamePlayerMoveState
}

export type HexagonRendererState = {
    hex: Hex
    player?: PlayerConfigItem
    currentPlayer?: PlayerConfigItem
    playersGameState: GamePlayersState
    playerMoveState: GamePlayerMoveState
    isCurrentPlayer: boolean
    isEnemyPlayer: boolean
    isFriendPlayer: boolean
    isHexAccessibleByPlayer: boolean
}
