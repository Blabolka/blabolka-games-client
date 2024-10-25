import dijkstrajs from 'dijkstrajs'
import { Grid, ring } from 'honeycomb-grid'
import { Hex } from '@entityTypes/hexaQuest'
import { aStar as aStarAbstract } from 'abstract-astar'
import { runTesting } from './hexagonPathfindingTesting'
import { findPath as customAStarFindPath } from '@services/algorithms/aStar'
import { findPath as customDijktraFindPath } from '@services/algorithms/dijkstra'
import { findPath as customBestFirstSearchFindPath } from '@services/algorithms/bestFirstSearch'
import { findPath as customBreadthFirstSearchFindPath } from '@services/algorithms/breadthFirstSearch'
import { findPath as customGreedyBestFirstSearchFindPath } from '@services/algorithms/greedyBestFirstSearch'

export enum GraphType {
    NORMAL = 'normal',
    RANDOM = 'random',
    INACCESSIBLE = 'inaccessible',
}

export type PathfindingAlgorithmResult = {
    path: Hex[]
    time: number
    processedNodes: number
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
    const graph: Record<string, Record<string, number>> = {}
    const tiles = grid.toArray()

    for (const tile of tiles) {
        const tileId = tile.toString()
        const neighbours: Record<string, number> = {}

        const neighborTiles = grid
            .traverse(
                ring({
                    radius: 1,
                    center: tile,
                }),
            )
            .toArray()

        for (const neighbourTile of neighborTiles) {
            const neighbourId = neighbourTile.toString()
            neighbours[neighbourId] = neighbourTile.config?.moveCost || Infinity
        }

        graph[tileId] = neighbours
    }

    return graph
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
            processedNodes: 0,
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
            processedNodes: 0,
        }
    }

    const aStarCustom = ({ grid, start, goal }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()
        const goalId = goal.toString()

        const started = Date.now()
        const { path: shortestPath, processedNodes } = customAStarFindPath(graph, startId, goalId, (tile) => {
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
            processedNodes,
        }
    }

    const dijkstraCustom = ({ grid, start, goal }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()
        const goalId = goal.toString()

        const started = Date.now()
        const { path: shortestPath, processedNodes } = customDijktraFindPath(graph, startId, goalId)
        const time = Date.now() - started

        const path = shortestPath.reduce<Hex[]>((memo, hexString: string) => {
            const hex = grid.getHex(parseHexStringCoordinates(hexString))
            return hex ? [...memo, hex] : memo
        }, [])

        return {
            path,
            time,
            processedNodes,
        }
    }

    const bestFirstSearchCustom = ({
        grid,
        start,
        goal,
    }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()
        const goalId = goal.toString()

        const started = Date.now()
        const { path: shortestPath, processedNodes } = customBestFirstSearchFindPath(graph, startId, goalId)
        const time = Date.now() - started

        const path = shortestPath.reduce<Hex[]>((memo, hexString: string) => {
            const hex = grid.getHex(parseHexStringCoordinates(hexString))
            return hex ? [...memo, hex] : memo
        }, [])

        return {
            path,
            time,
            processedNodes,
        }
    }

    const greedyBestFirstSearchCustom = ({
        grid,
        start,
        goal,
    }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()
        const goalId = goal.toString()

        const started = Date.now()
        const { path: shortestPath, processedNodes } = customGreedyBestFirstSearchFindPath(
            graph,
            startId,
            goalId,
            (tile) => {
                const hex = grid.getHex(parseHexStringCoordinates(tile))
                return hex ? grid.distance(hex, goal) : Infinity
            },
        )
        const time = Date.now() - started

        const path = shortestPath.reduce<Hex[]>((memo, hexString: string) => {
            const hex = grid.getHex(parseHexStringCoordinates(hexString))
            return hex ? [...memo, hex] : memo
        }, [])

        return {
            path,
            time,
            processedNodes,
        }
    }

    const breadthFirstSearchCustom = ({
        grid,
        start,
        goal,
    }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()
        const goalId = goal.toString()

        const started = Date.now()
        const { path: shortestPath, processedNodes } = customBreadthFirstSearchFindPath(graph, startId, goalId)
        const time = Date.now() - started

        const path = shortestPath.reduce<Hex[]>((memo, hexString: string) => {
            const hex = grid.getHex(parseHexStringCoordinates(hexString))
            return hex ? [...memo, hex] : memo
        }, [])

        return {
            path,
            time,
            processedNodes,
        }
    }

    return {
        aStar,
        dijkstra,
        aStarCustom,
        dijkstraCustom,
        bestFirstSearchCustom,
        breadthFirstSearchCustom,
        greedyBestFirstSearchCustom,
        runTesting,
    }
}

export default hexagonPathfinding()
