import { Hex } from '@entityTypes/hexaQuest'
import { Grid, ring } from 'honeycomb-grid'
import { aStar as aStarAbstract } from 'abstract-astar'

const hexagonPathfinding = () => {
    const aStar = (grid: Grid<Hex>, start: Hex, goal: Hex) => {
        return aStarAbstract<Hex>({
            start,
            goal,
            estimateFromNodeToGoal: (tile) => grid.distance(tile, goal),
            neighborsAdjacentToNode: (center) => grid.traverse(ring({ radius: 1, center })).toArray(),
            actualCostToMove: (_, __, tile) => tile.config?.moveCost || Infinity,
        })
    }

    return { aStar }
}

export default hexagonPathfinding()
