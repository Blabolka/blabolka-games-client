import dijkstrajs from 'dijkstrajs'
import { Grid, ring } from 'honeycomb-grid'
import { Hex } from '@entityTypes/hexaQuest'
import { aStar as aStarAbstract } from 'abstract-astar'
import { runTesting } from './hexagonPathfindingTesting'
import { findPath as customAStarFindPath } from '@services/algorithms/aStar'
import { findPath as customDijktraFindPath } from '@services/algorithms/dijkstra'

export enum GridType {
    NORMAL = 'normal',
    RANDOM = 'random',
    INACCESSIBLE = 'inaccessible',
}

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

const getWeightedGraphFromGrid = (grid: Grid<Hex>): Record<string, Record<string, number>> => {
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

    const aStarCustom = ({ grid, start, goal }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)

        const started = Date.now()
        const { path: shortestPath } = customAStarFindPath(graph, start.toString(), goal.toString(), (tile) => {
            const hex = grid.getHex(parseHexStringCoordinates(tile))
            return hex ? grid.distance(hex, goal) : Infinity
        })
        const time = Date.now() - started

        const path = shortestPath.reduce<Hex[]>((memo, hexString: string) => {
            const hex = grid.getHex(parseHexStringCoordinates(hexString))
            return hex ? [...memo, hex] : memo
        }, [])

        return {
            path,
            time,
        }
    }

    const dijkstraCustom = ({ grid, start, goal }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()
        const goalId = goal.toString()

        const started = Date.now()
        const { path: shortestPath } = customDijktraFindPath(graph, startId, goalId)
        const time = Date.now() - started

        const path = shortestPath.reduce<Hex[]>((memo, hexString: string) => {
            const hex = grid.getHex(parseHexStringCoordinates(hexString))
            return hex ? [...memo, hex] : memo
        }, [])

        return {
            path,
            time,
        }
    }

    return { aStar, dijkstra, aStarCustom, dijkstraCustom, runTesting }
}

export default hexagonPathfinding()
