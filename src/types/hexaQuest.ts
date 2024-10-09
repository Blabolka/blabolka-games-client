import { Hex as HoneycombHex } from 'honeycomb-grid'

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
