import { Hex } from '@entityTypes/hexaQuest'
import { defineHex, Grid, Orientation, spiral } from 'honeycomb-grid'

import hexagonPathfinding, { GridType, PathfindingAlgorithmRequiredData } from './hexagonPathfinding'

export const updateGridWithNormalMoveCosts = (grid: Grid<Hex>) => {
    return grid.map((hex: Hex) => {
        const newHex: Hex = hex.clone()
        newHex.config = { moveCost: 1 }
        return newHex
    })
}

export const updateGridWithRandomMoveCosts = (grid: Grid<Hex>) => {
    return grid.map((hex: Hex) => {
        const newHex: Hex = hex.clone()
        newHex.config = { moveCost: Math.ceil(Math.random() * 10) }
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

export const calculateEveryAlgorithmResult = ({ grid, start, goal }: PathfindingAlgorithmRequiredData) => {
    return {
        aStar: hexagonPathfinding.aStarCustom({ grid, start, goal }),
        dijkstra: hexagonPathfinding.dijkstraCustom({ grid, start, goal }),
    }
}

export const calculatePathToEveryNode = (grid: Grid<Hex>, startHexagon?: Hex) => {
    if (!startHexagon) return {}

    return grid.reduce(
        (memo, hex) => {
            const { aStar, dijkstra } = calculateEveryAlgorithmResult({
                grid,
                start: startHexagon,
                goal: hex,
            })

            return {
                aStar: { time: memo.aStar.time + aStar.time, nodes: 0 },
                dijkstra: { time: memo.dijkstra.time + dijkstra.time, nodes: 0 },
            }
        },
        { aStar: { time: 0, nodes: 0 }, dijkstra: { time: 0, nodes: 0 } },
    )
}

export const runTesting = () => {
    const getGridByGridData = (gridData: any) => {
        const grid = new Grid(Tile, spiral({ radius: gridData.radius }))

        switch (gridData.type) {
            case GridType.NORMAL:
                return updateGridWithNormalMoveCosts(grid)
            case GridType.RANDOM:
                return updateGridWithRandomMoveCosts(grid)
            case GridType.INACCESSIBLE:
                return updateGridWithInaccessibleMoveCosts(grid, gridData.obstacleRatio)
        }

        return grid
    }

    const getGridTestingLabel = (gridData: any) => {
        const variables = [
            { label: 'radius', value: gridData.radius },
            { label: 'items', value: gridData.grid.toArray().length },
            { label: 'obstacleRatio', value: gridData.obstacleRatio },
        ]

        const variablesMeta = variables
            .filter((item) => !!item.value)
            .map(({ label, value }) => `${label}: ${value}`)
            .join(', ')

        return `${gridData.label} (${variablesMeta})`
    }

    const parseCalculationResultToTable = (calculationResults: any, resultKey: string) => {
        return calculationResults.reduce((memo, gridData) => {
            return {
                ...memo,
                [getGridTestingLabel(gridData)]: Object.entries(gridData.result).reduce(
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
    const testingGridRadius = [6]
    const grids = [
        { label: 'Normal Move Cost', type: GridType.NORMAL },
        { label: 'Random Move Cost', type: GridType.RANDOM },
        { label: 'Inaccessible Move Cost', type: GridType.INACCESSIBLE, obstacleRatio: 0.2 },
        { label: 'Inaccessible Move Cost', type: GridType.INACCESSIBLE, obstacleRatio: 0.5 },
        { label: 'Inaccessible Move Cost', type: GridType.INACCESSIBLE, obstacleRatio: 0.8 },
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

    const calculationResults = grids.map((gridData) => {
        return {
            ...gridData,
            result: calculatePathToEveryNode(
                gridData.grid,
                gridData.grid.getHex({
                    q: 0,
                    r: 0,
                }),
            ),
        }
    })

    const timeToFindPathToEveryNodeFromCenter = parseCalculationResultToTable(calculationResults, 'time')
    const iteratedNodesToFindPathToEveryNodeFromCenter = parseCalculationResultToTable(calculationResults, 'nodes')

    console.log('\n\n\n')
    console.log('Time to find path to every node from center:')
    console.table(timeToFindPathToEveryNodeFromCenter)

    console.log('\n\n\n')
    console.log('Time to find path to every node from center:')
    console.table(iteratedNodesToFindPathToEveryNodeFromCenter)
}
