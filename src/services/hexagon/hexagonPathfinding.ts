import { Grid, ring } from 'honeycomb-grid'
import { Hex } from '@entityTypes/hexaQuest'
import { runTesting } from './hexagonPathfindingTesting'
import { parseHexStringCoordinates } from '@utils/hexaQuest'

import { findPath as aStarFindPath } from '@services/algorithms/aStar'
import { findPath as dijktraFindPath } from '@services/algorithms/dijkstra'
import { findPath as breadthFirstSearchFindPath } from '@services/algorithms/breadthFirstSearch'
import { findPath as greedyBestFirstSearchFindPath } from '@services/algorithms/greedyBestFirstSearch'

import { findAllPaths as dijktraFindAllPaths } from '@services/algorithms/dijkstraAllPaths'
import { findAllPaths as breadthFirstSearchFindAllPaths } from '@services/algorithms/breadthFirstSearchAllPaths'
import { findAllPaths as spfaSearchFindAllPaths } from '@services/algorithms/shortestPathFasterAlgorithmSearchAllPaths'

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

export type PathfindingToAllAlgorithmResult = {
    paths: Record<string, { path: string[]; cost: number }>
    time: number
    processedNodes: number
}

export type PathfindingToAllAlgorithmRequiredData = {
    grid: Grid<Hex>
    start: Hex
}

const getGraphFromGrid = (grid: Grid<Hex>): Record<string, string[]> => {
    const graph: Record<string, string[]> = {}
    const tiles = grid.toArray()

    for (const tile of tiles) {
        const tileId = tile.toString()

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
            graph[tileId] = [...(graph[tileId] || []), neighbourId]
        }
    }

    return graph
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
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()
        const goalId = goal.toString()

        const started = Date.now()
        const { path: shortestPath, processedNodes } = aStarFindPath(graph, startId, goalId, (tile) => {
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

    const dijkstra = ({ grid, start, goal }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()
        const goalId = goal.toString()

        const started = Date.now()
        const { path: shortestPath, processedNodes } = dijktraFindPath(graph, startId, goalId)
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

    const dijkstraAllPaths = ({
        grid,
        start,
    }: PathfindingToAllAlgorithmRequiredData): PathfindingToAllAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()

        const started = Date.now()
        const { paths, processedNodes } = dijktraFindAllPaths(graph, startId)
        const time = Date.now() - started

        return {
            paths,
            time,
            processedNodes,
        }
    }

    const greedyBestFirstSearch = ({
        grid,
        start,
        goal,
    }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()
        const goalId = goal.toString()

        const started = Date.now()
        const { path: shortestPath, processedNodes } = greedyBestFirstSearchFindPath(graph, startId, goalId, (tile) => {
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

    const breadthFirstSearch = ({
        grid,
        start,
        goal,
    }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()
        const goalId = goal.toString()

        const started = Date.now()
        const { path: shortestPath, processedNodes } = breadthFirstSearchFindPath(graph, startId, goalId)
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

    const breadthFirstSearchAllPaths = ({
        grid,
        start,
    }: PathfindingToAllAlgorithmRequiredData): PathfindingToAllAlgorithmResult => {
        const graph = getGraphFromGrid(grid)
        const startId = start.toString()

        const started = Date.now()
        const { paths, processedNodes } = breadthFirstSearchFindAllPaths(graph, startId)
        const time = Date.now() - started

        return {
            paths,
            time,
            processedNodes,
        }
    }

    const spfaSearchAllPaths = ({
        grid,
        start,
    }: PathfindingToAllAlgorithmRequiredData): PathfindingToAllAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()

        const started = Date.now()
        const { paths, processedNodes } = spfaSearchFindAllPaths(graph, startId)
        const time = Date.now() - started

        return {
            paths,
            time,
            processedNodes,
        }
    }

    return {
        runTesting,
        aStar,
        dijkstra,
        dijkstraAllPaths,
        spfaSearchAllPaths,
        greedyBestFirstSearch,
        breadthFirstSearch,
        breadthFirstSearchAllPaths,
    }
}

export default hexagonPathfinding()
