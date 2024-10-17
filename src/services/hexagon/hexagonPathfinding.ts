import dijkstrajs from 'dijkstrajs'
import { Hex } from '@entityTypes/hexaQuest'
import { aStar as aStarAbstract } from 'abstract-astar'
import { defineHex, Grid, Orientation, ring, spiral } from 'honeycomb-grid'
import { updateGridMoveCosts, calculateTimeToFindPathToEveryNode } from './hexagonPathfindingTesting'

export type PathfindingAlgorithmResult = {
    path: Hex[]
    time: number
}

export type PathfindingAlgorithmRequiredData = {
    grid: Grid<Hex>
    start: Hex
    goal: Hex
}

const parseHexStringCoordinates = (hexStringCoordinates: string) => {
    const [q, r, s] = hexStringCoordinates.slice(1, -1).split(',')
    return { q: Number(q), r: Number(r), s: Number(s) }
}

const getWeightedGraphFromGrid = (grid: Grid<Hex>) => {
    return grid.reduce((graph, tile) => {
        const neighbours = grid
            .traverse(
                ring({
                    radius: 1,
                    center: tile,
                }),
            )
            .reduce(
                (neighboursGraph, neighbourTile) => ({
                    ...neighboursGraph,
                    [neighbourTile.toString()]: neighbourTile.config?.moveCost || Infinity,
                }),
                {},
            )

        return {
            ...graph,
            [tile.toString()]: neighbours,
        }
    }, {})
}

const hexagonPathfinding = () => {
    const aStar = ({ grid, start, goal }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const started = Date.now()
        const path = aStarAbstract<Hex>({
            start,
            goal,
            estimateFromNodeToGoal: (tile) => grid.distance(tile, goal),
            neighborsAdjacentToNode: (center) => grid.traverse(ring({ radius: 1, center })).toArray(),
            actualCostToMove: (_, __, tile) => tile.config?.moveCost || Infinity,
        })

        return {
            path: path || [],
            time: Date.now() - started,
        }
    }

    const dijkstra = ({ grid, start, goal }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)

        const started = Date.now()
        const shortestPath = dijkstrajs.find_path(graph, start.toString(), goal.toString())
        const time = Date.now() - started

        const path = shortestPath.map((hexStringCoordinates: string) =>
            grid.getHex(parseHexStringCoordinates(hexStringCoordinates)),
        )

        return {
            path,
            time,
        }
    }

    const runTesting = () => {
        const Tile = defineHex({ dimensions: 40, origin: 'topLeft', orientation: Orientation.FLAT })
        const grids = [
            { label: 'Small Grid', radius: 4 },
            { label: 'Medium Grid', radius: 6 },
            { label: 'Large Grid', radius: 8 },
            { label: 'X Large Grid', radius: 10 },
        ].map((gridData) => ({
            ...gridData,
            grid: updateGridMoveCosts(new Grid(Tile, spiral({ radius: gridData.radius }))),
        }))

        const timeToFindPathToEveryNode = grids.reduce(
            (memo, gridData) => ({
                ...memo,
                [`${gridData.label} (radius ${gridData.radius}, items: ${gridData.grid.toArray().length})`]:
                    calculateTimeToFindPathToEveryNode(
                        gridData.grid,
                        gridData.grid.getHex({
                            q: 0,
                            r: 0,
                        }),
                    ),
            }),
            {},
        )

        console.log('\n\n')
        console.info('Time to find path to every node:')
        console.table(timeToFindPathToEveryNode)
        console.log('\n\n')
    }

    return { aStar, dijkstra, runTesting }
}

export default hexagonPathfinding()
