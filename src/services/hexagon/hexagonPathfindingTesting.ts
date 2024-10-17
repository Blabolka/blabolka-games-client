import { Grid } from 'honeycomb-grid'
import { Hex } from '@entityTypes/hexaQuest'

import hexagonPathfinding, { PathfindingAlgorithmRequiredData } from './hexagonPathfinding'

export const updateGridMoveCosts = (grid: Grid<Hex>) => {
    return grid.map((hex: Hex) => {
        const newHex: Hex = hex.clone()
        newHex.config = { moveCost: 1 }
        return newHex
    })
}

export const findEveryAlgorithmTime = ({ grid, start, goal }: PathfindingAlgorithmRequiredData) => {
    return {
        aStar: hexagonPathfinding.aStar({ grid, start, goal }).time,
        dijkstra: hexagonPathfinding.dijkstra({ grid, start, goal }).time,
    }
}

export const calculateTimeToFindPathToEveryNode = (grid: Grid<Hex>, startHexagon?: Hex) => {
    if (!startHexagon) return {}

    return grid.reduce(
        (memo, hex) => {
            const { aStar, dijkstra } = findEveryAlgorithmTime({ grid, start: startHexagon, goal: hex })
            return { aStar: memo.aStar + aStar, dijkstra: memo.dijkstra + dijkstra }
        },
        { aStar: 0, dijkstra: 0 },
    )
}
