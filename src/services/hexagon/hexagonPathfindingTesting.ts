import { Hex } from '@entityTypes/hexaQuest'
import { defineHex, Grid, Orientation, spiral } from 'honeycomb-grid'

import hexagonPathfinding, { PathfindingAlgorithmRequiredData } from './hexagonPathfinding'

export enum GraphType {
    NORMAL = 'normal',
    RANDOM = 'random',
    INACCESSIBLE = 'inaccessible',
}

export const updateGridWithNormalMoveCosts = (grid: Grid<Hex>) => {
    return grid.map((hex: Hex) => {
        const newHex: Hex = hex.clone()
        newHex.config = { moveCost: 1 }
        return newHex
    })
}

export const updateGridWithRandomMoveCosts = (grid: Grid<Hex>, randomRatio: number) => {
    return grid.map((hex: Hex) => {
        const newHex: Hex = hex.clone()
        newHex.config = { moveCost: Math.random() < randomRatio ? Math.ceil(Math.random() * 10) : 1 }
        return newHex
    })
}

export const updateGridWithInaccessibleMoveCosts = (grid: Grid<Hex>, obstacleRatio: number) => {
    return grid.map((hex: Hex) => {
        const newHex: Hex = hex.clone()
        newHex.config = { moveCost: Math.random() < obstacleRatio ? Infinity : 1 }
        return newHex
    })
}

export const calculateEveryAlgorithmResultFromStart = ({
    grid,
    start,
}: Required<Pick<PathfindingAlgorithmRequiredData, 'grid' | 'start'>>) => {
    return {
        breadthFirstSearch: hexagonPathfinding.breadthFirstSearchAllPaths({ grid, start }),
        dijkstra: hexagonPathfinding.dijkstraAllPaths({ grid, start }),
        spfaSearch: hexagonPathfinding.spfaSearchAllPaths({ grid, start }),
    }
}

export const calculateEveryAlgorithmResultFromStartToGoal = ({
    grid,
    start,
    goal,
}: PathfindingAlgorithmRequiredData) => {
    return {
        aStar: hexagonPathfinding.aStar({ grid, start, goal }),
        dijkstra: hexagonPathfinding.dijkstra({ grid, start, goal }),
        breadthFirstSearch: hexagonPathfinding.breadthFirstSearch({ grid, start, goal }),
        greedyBestFirstSearch: hexagonPathfinding.greedyBestFirstSearch({ grid, start, goal }),
    }
}

export const findPathFromStartToEveryNode = (grid: Grid<Hex>, startHexagon?: Hex) => {
    if (!startHexagon) return {}

    const { dijkstra, spfaSearch, breadthFirstSearch } = calculateEveryAlgorithmResultFromStart({
        grid,
        start: startHexagon,
    })

    return {
        breadthFirstSearch: {
            time: breadthFirstSearch?.time,
            processedNodes: breadthFirstSearch?.processedNodes,
        },
        spfaSearch: {
            time: spfaSearch?.time,
            processedNodes: spfaSearch?.processedNodes,
        },
        dijkstra: {
            time: dijkstra?.time,
            processedNodes: dijkstra?.processedNodes,
        },
    }
}

export const findPathFromStartToEveryNodeOneByOne = (grid: Grid<Hex>, startHexagon?: Hex) => {
    if (!startHexagon) return {}

    return grid.reduce(
        (memo, hex) => {
            const { aStar, dijkstra, breadthFirstSearch, greedyBestFirstSearch } =
                calculateEveryAlgorithmResultFromStartToGoal({
                    grid,
                    start: startHexagon,
                    goal: hex,
                })

            return {
                greedyBestFirstSearch: {
                    time: memo.greedyBestFirstSearch.time + greedyBestFirstSearch?.time,
                    processedNodes: memo.greedyBestFirstSearch.processedNodes + greedyBestFirstSearch?.processedNodes,
                },
                aStar: {
                    time: memo.aStar.time + (aStar?.time || 0),
                    processedNodes: memo.aStar.processedNodes + (aStar?.processedNodes || 0),
                },
                breadthFirstSearch: {
                    time: memo.breadthFirstSearch.time + breadthFirstSearch?.time,
                    processedNodes: memo.breadthFirstSearch.processedNodes + breadthFirstSearch?.processedNodes,
                },
                dijkstra: {
                    time: memo.dijkstra.time + dijkstra?.time,
                    processedNodes: memo.dijkstra.processedNodes + dijkstra?.processedNodes,
                },
            }
        },
        {
            greedyBestFirstSearch: { time: 0, processedNodes: 0 },
            aStar: { time: 0, processedNodes: 0 },
            breadthFirstSearch: { time: 0, processedNodes: 0 },
            dijkstra: { time: 0, processedNodes: 0 },
        },
    )
}

export const runTesting = () => {
    const getGridByGridData = (gridData: any) => {
        const grid = new Grid(Tile, spiral({ radius: gridData.radius }))

        switch (gridData.type) {
            case GraphType.NORMAL:
                return updateGridWithNormalMoveCosts(grid)
            case GraphType.RANDOM:
                return updateGridWithRandomMoveCosts(grid, gridData.randomRatio)
            case GraphType.INACCESSIBLE:
                return updateGridWithInaccessibleMoveCosts(grid, gridData.obstacleRatio)
        }

        return grid
    }

    const getGridTestingLabel = (gridData: any, index: number) => {
        const variables = [
            { label: 'radius', value: gridData.radius },
            { label: 'items', value: gridData.grid.toArray().length },
            { label: 'randomRatio', value: gridData.randomRatio },
            { label: 'obstacleRatio', value: gridData.obstacleRatio },
        ]

        const variablesMeta = variables
            .filter((item) => !!item.value)
            .map(({ label, value }) => `${label}: ${value}`)
            .join(', ')

        return `${gridData.label} (${variablesMeta}) - ${index}`
    }

    const parseCalculationResultToTable = (calculationResults: any, resultKey: string) => {
        return calculationResults.reduce((memo, gridData, index: number) => {
            return {
                ...memo,
                [getGridTestingLabel(gridData, index)]: Object.entries(gridData.result).reduce(
                    (memo, [key, value]: any) => ({
                        ...memo,
                        [key]: value?.[resultKey],
                    }),
                    {},
                ),
            }
        }, {})
    }

    const Tile = defineHex({ dimensions: 40, origin: 'topLeft', orientation: Orientation.FLAT })

    // const testingGridRadius = [10, 10, 10] // For testing from center to every node one by one
    const testingGridRadius = [100, 100, 100] // For testing from center to every node

    const grids = [
        { label: 'Normal Move Cost', type: GraphType.NORMAL },
        // { label: 'Random Move Cost', type: GraphType.RANDOM, randomRatio: 0.2 },
        // { label: 'Random Move Cost', type: GraphType.RANDOM, randomRatio: 0.5 },
        // { label: 'Random Move Cost', type: GraphType.RANDOM, randomRatio: 0.8 },
        // { label: 'Random Move Cost', type: GraphType.RANDOM, randomRatio: 1 },
        // { label: 'Inaccessible Move Cost', type: GraphType.INACCESSIBLE, obstacleRatio: 0.2 },
        // { label: 'Inaccessible Move Cost', type: GraphType.INACCESSIBLE, obstacleRatio: 0.5 },
        // { label: 'Inaccessible Move Cost', type: GraphType.INACCESSIBLE, obstacleRatio: 0.8 },
    ]
        .map((gridData) =>
            testingGridRadius.map((gridRadius) => {
                const updatedGridData = {
                    ...gridData,
                    radius: gridRadius,
                }

                return {
                    ...updatedGridData,
                    grid: getGridByGridData(updatedGridData),
                }
            }),
        )
        .flat()

    const pathFromStartToEveryNodeCalculationResult = grids.map((gridData) => {
        return {
            ...gridData,
            result: findPathFromStartToEveryNode(
                gridData.grid,
                gridData.grid.getHex({
                    q: 0,
                    r: 0,
                }),
            ),
        }
    })

    const timeToFindPathFromStartToEveryNode = parseCalculationResultToTable(
        pathFromStartToEveryNodeCalculationResult,
        'time',
    )
    const processedNodesToFindPathFromStartToEveryNode = parseCalculationResultToTable(
        pathFromStartToEveryNodeCalculationResult,
        'processedNodes',
    )

    console.log('\n\n\n')
    console.log('Time to find path from start to every node:')
    console.table(timeToFindPathFromStartToEveryNode)

    console.log('\n\n\n')
    console.log('Processed nodes to find path from start to every node:')
    console.table(processedNodesToFindPathFromStartToEveryNode)

    // const pathFromStartToEveryNodeOneByOneCalculationResult = grids.map((gridData) => {
    //     return {
    //         ...gridData,
    //         result: findPathFromStartToEveryNodeOneByOne(
    //             gridData.grid,
    //             gridData.grid.getHex({
    //                 q: 0,
    //                 r: 0,
    //             }),
    //         ),
    //     }
    // })
    //
    // const timeToFindPathFromStartToEveryNodeOneByOne = parseCalculationResultToTable(
    //     pathFromStartToEveryNodeOneByOneCalculationResult,
    //     'time',
    // )
    // const processedNodesToFindPathFromStartToEveryNodeOneByOne = parseCalculationResultToTable(
    //     pathFromStartToEveryNodeOneByOneCalculationResult,
    //     'processedNodes',
    // )
    //
    // console.log('\n\n\n')
    // console.log('Time to find path from start to every node one by one:')
    // console.table(timeToFindPathFromStartToEveryNodeOneByOne)
    //
    // console.log('\n\n\n')
    // console.log('Processed nodes to find path from start to every node one by one:')
    // console.table(processedNodesToFindPathFromStartToEveryNodeOneByOne)
}
