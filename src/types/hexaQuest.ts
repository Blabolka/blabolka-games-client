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
    IMPASSABLE = 'impassable',
}

export type HexConfig = {
    type?: HexType
    moveCost?: number
}

export type Hex = HoneycombHex & { config?: HexConfig }
export type HexesConfigItem = { coordinates: Coordinates; config: HexConfig }

// Team types
export enum TeamType {
    FRIEND = 'friend',
    ENEMY = 'enemy',
}

// Player types
export enum PlayerType {
    WARRIOR = 'warrior',
}

export type PlayerConfig = {
    type: PlayerType
    team: TeamType
    numberOfMoveCostPerTurn: number
    remainingMoveCost: number
}

export type PlayerConfigItem = { coordinates: Coordinates; config: PlayerConfig }

export type GamePlayerMoveState = {
    path: Hex[]
    availableHexesToMove: Hex[]
}

export type GamePlayersState = {
    players: PlayerConfigItem[]
    currentPlayerCoordinates?: Coordinates
}
