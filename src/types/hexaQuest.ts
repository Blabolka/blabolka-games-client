import { Hex as HoneycombHex } from 'honeycomb-grid'

// Hex types
export enum HexType {
    DEFAULT = 'default',
    FOREST = 'forest',
    WATER = 'water',
    IMPASSABLE = 'impassable',
}

export type HexConfig = {
    type?: HexType
    moveCost?: number
}

export type Hex = HoneycombHex & { config?: HexConfig }
export type HexesConfigItem = { coordinates: { q: number; r: number }; config: HexConfig }

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
}

export type PlayerConfigItem = { coordinates: { q: number; r: number }; config: PlayerConfig }

export type GamePlayerMoveState = {
    path: Hex[]
}

export type GamePlayersState = {
    players: PlayerConfigItem[]
    currentPlayer?: PlayerConfigItem
}
