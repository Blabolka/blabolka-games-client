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

export enum PlayerViewDirections {
    LEFT = 'left',
    RIGHT = 'right',
}

export type PlayerConfig = {
    type: PlayerType
    team: TeamType
    lastViewDirection: PlayerViewDirections
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
    offset?: number
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

// Renderer types
export enum AnimationType {
    IDLE = 'idle',
    DEATH = 'death',
    ATTACK = 'attack',
}

export type Animation = {
    coordinates: Coordinates
    animationType: AnimationType
    onAnimationEnd?: () => void
}

export type RenderDataProps = {
    animations: Animation[]
    currentPlayer?: PlayerConfigItem
    playersGameState: GamePlayersState
    playerMoveState: GamePlayerMoveState
}

export type HexagonRendererDataProps = RenderDataProps & {
    hex: Hex
}

export type HexagonRendererState = {
    hex: Hex
    animation?: Animation
    player?: PlayerConfigItem
    currentPlayer?: PlayerConfigItem
    playersGameState: GamePlayersState
    playerMoveState: GamePlayerMoveState
    isCurrentPlayer: boolean
    isEnemyPlayer: boolean
    isFriendPlayer: boolean
    isHexAccessibleByPlayer: boolean
}
