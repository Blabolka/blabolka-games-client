import dijkstrajs from 'dijkstrajs'
import { Grid, ring } from 'honeycomb-grid'
import { Hex } from '@entityTypes/hexaQuest'
import { aStar as aStarAbstract } from 'abstract-astar'
import { runTesting } from './hexagonPathfindingTesting'
import { findPath as customAStarFindPath } from '@services/algorithms/aStar'
import { findPath as customDijktraFindPath } from '@services/algorithms/dijkstra'
import { findPath as customJumpPointSearchFindPath } from '@services/algorithms/jumpPointSearch'

export enum GridType {
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

const stringifyHexCoordinates = (q: number, r: number) => {
    return `(${q},${r})`
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

        const started = Date.now()
        const { path: shortestPath, processedNodes } = customAStarFindPath(
            graph,
            start.toString(),
            goal.toString(),
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

    const jumpPointSearchCustom = ({
        grid,
        start,
        goal,
    }: PathfindingAlgorithmRequiredData): PathfindingAlgorithmResult => {
        const graph = getWeightedGraphFromGrid(grid)
        const startId = start.toString()
        const goalId = goal.toString()

        const started = Date.now()
        const { path: shortestPath, processedNodes } = customJumpPointSearchFindPath({
            graph,
            start: startId,
            goal: goalId,
            getDirection: (fromNode, toNode) => {
                const { q: fromQ, r: fromR } = parseHexStringCoordinates(fromNode)
                const { q: toQ, r: toR } = parseHexStringCoordinates(toNode)

                const dq = toQ - fromQ
                const dr = toR - fromR

                if (dq === 0 && dr === -1) return 'N'
                if (dq === 1 && dr === -1) return 'NE'
                if (dq === 1 && dr === 0) return 'SE'
                if (dq === 0 && dr === 1) return 'S'
                if (dq === -1 && dr === 1) return 'SW'
                if (dq === -1 && dr === 0) return 'NW'

                return ''
            },
            getNextNode: (currentNode: string, direction: string) => {
                const { q, r } = parseHexStringCoordinates(currentNode)

                switch (direction) {
                    case 'N':
                        return stringifyHexCoordinates(q, r - 1)
                    case 'NE':
                        return stringifyHexCoordinates(q + 1, r - 1)
                    case 'SE':
                        return stringifyHexCoordinates(q + 1, r)
                    case 'S':
                        return stringifyHexCoordinates(q, r + 1)
                    case 'SW':
                        return stringifyHexCoordinates(q - 1, r + 1)
                    case 'NW':
                        return stringifyHexCoordinates(q - 1, r)
                    default:
                        return undefined
                }
            },
            estimateFromNodeToGoal: (currentNode: string) => {
                const hex = grid.getHex(parseHexStringCoordinates(currentNode))
                return hex ? grid.distance(hex, goal) : Infinity
            },
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

    return { aStar, dijkstra, aStarCustom, dijkstraCustom, jumpPointSearchCustom, runTesting }
}

export default hexagonPathfinding()
