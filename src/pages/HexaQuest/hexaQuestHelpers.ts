import { Grid, rectangle, defineHex } from 'honeycomb-grid'
import { Hex, HexType, HexConfig } from '@entityTypes/hexaQuest'

type HexesConfigItem = { q: number; r: number; config: HexConfig }

const MOVE_COST_BY_HEX_TYPE = {
    [HexType.DEFAULT]: 1,
    [HexType.FOREST]: 2,
    [HexType.WATER]: 3,
    [HexType.IMPASSABLE]: Infinity,
}

const DEFAULT_HEX_CONFIG: HexConfig = {
    type: HexType.DEFAULT,
}

const HEXES_CONFIG: HexesConfigItem[] = [
    { q: 1, r: 4, config: { type: HexType.FOREST } },
    { q: 2, r: 4, config: { type: HexType.FOREST } },
    { q: 0, r: 7, config: { type: HexType.WATER } },
    { q: 1, r: 7, config: { type: HexType.WATER } },
    { q: 2, r: 7, config: { type: HexType.WATER } },
    { q: 3, r: 7, config: { type: HexType.WATER } },
]

export const getConfigByHex = (config: HexesConfigItem[], hex: Hex) => {
    const configItem = config.find(({ q, r }) => hex.q === q && hex.r === r)
    return configItem?.config || DEFAULT_HEX_CONFIG
}

export const getMoveCostByType = (type?: HexType) => {
    const costByType = type ? MOVE_COST_BY_HEX_TYPE[type] : 0
    return costByType || MOVE_COST_BY_HEX_TYPE[HexType.DEFAULT]
}

export const getInitialGridConfig = () => {
    const Tile = defineHex({ dimensions: 40, origin: 'topLeft' })
    return new Grid(Tile, rectangle({ width: 10, height: 10 })).forEach((hex: Hex) => {
        const hexConfig = getConfigByHex(HEXES_CONFIG, hex)
        hex.config = {
            ...hexConfig,
            moveCost: getMoveCostByType(hexConfig?.type),
        }
    })
}
