import { Heap } from 'heap-js'

function getNeighborDirections(direction) {
    const neighborMap = {
        N: ['NE', 'NW'],
        NE: ['N', 'SE'],
        SE: ['NE', 'S'],
        S: ['SE', 'SW'],
        SW: ['NW', 'S'],
        NW: ['N', 'SW'],
    }
    return neighborMap[direction] || []
}

function hasForcedNeighbor(graph, nodeKey, direction) {
    const [q, r] = nodeKey.slice(1, -1).split(',').map(Number)

    const isForcedNeighbor = (fromNodeKey, toNodeKey) => {
        const neighbors = graph[fromNodeKey]
        return neighbors && neighbors[toNodeKey] !== undefined && neighbors[toNodeKey] !== Infinity
    }

    switch (direction) {
        case 'N':
            if (
                (!isForcedNeighbor(nodeKey, `(${q - 1},${r + 1})`) && isForcedNeighbor(nodeKey, `(${q - 1},${r})`)) ||
                (!isForcedNeighbor(nodeKey, `(${q + 1},${r})`) && isForcedNeighbor(nodeKey, `(${q + 1},${r - 1})`))
            ) {
                return true
            }
            break
        case 'NE':
            if (
                (!isForcedNeighbor(nodeKey, `(${q - 1},${r})`) && isForcedNeighbor(nodeKey, `(${q},${r - 1})`)) ||
                (!isForcedNeighbor(nodeKey, `(${q},${r + 1})`) && isForcedNeighbor(nodeKey, `(${q + 1},${r})`))
            ) {
                return true
            }
            break
        case 'SE':
            if (
                (!isForcedNeighbor(nodeKey, `(${q},${r - 1})`) && isForcedNeighbor(nodeKey, `(${q + 1},${r - 1})`)) ||
                (!isForcedNeighbor(nodeKey, `(${q - 1},${r + 1})`) && isForcedNeighbor(nodeKey, `(${q},${r + 1})`))
            ) {
                return true
            }
            break
        case 'S':
            if (
                (!isForcedNeighbor(nodeKey, `(${q + 1},${r - 1})`) && isForcedNeighbor(nodeKey, `(${q + 1},${r})`)) ||
                (!isForcedNeighbor(nodeKey, `(${q - 1},${r})`) && isForcedNeighbor(nodeKey, `(${q - 1},${r + 1})`))
            ) {
                return true
            }
            break
        case 'SW':
            if (
                (!isForcedNeighbor(nodeKey, `(${q + 1},${r})`) && isForcedNeighbor(nodeKey, `(${q},${r + 1})`)) ||
                (!isForcedNeighbor(nodeKey, `(${q},${r - 1})`) && isForcedNeighbor(nodeKey, `(${q - 1},${r})`))
            ) {
                return true
            }
            break
        case 'NW':
            if (
                (!isForcedNeighbor(nodeKey, `(${q},${r + 1})`) && isForcedNeighbor(nodeKey, `(${q - 1},${r + 1})`)) ||
                (!isForcedNeighbor(nodeKey, `(${q + 1},${r - 1})`) && isForcedNeighbor(nodeKey, `(${q},${r - 1})`))
            ) {
                return true
            }
            break
        default:
            throw new Error(`Unknown direction for nodeKey: ${nodeKey}`)
    }
    return false
}

const jump = ({ graph, currentNode, goal, direction, getNextNode, getNeighborDirections, hasForcedNeighbor }) => {
    const jumpResults = []
    let path = []
    let totalCost = 0

    while (currentNode && graph[currentNode]) {
        // First, traverse neighborDirections
        const neighborDirections = getNeighborDirections(direction)
        for (const neighborDirection of neighborDirections) {
            let neighborCurrentNode = currentNode
            let neighborPath = []
            let neighborTotalCost = 0
            let neighborNextNode = getNextNode(neighborCurrentNode, neighborDirection)

            while (neighborNextNode && graph[neighborNextNode]) {
                neighborTotalCost += graph[neighborCurrentNode][neighborNextNode]
                neighborPath.push(neighborNextNode)

                if (neighborNextNode === goal || hasForcedNeighbor(graph, neighborNextNode, neighborDirection)) {
                    // Found a jumpNode
                    jumpResults.push({
                        jumpNode: neighborNextNode,
                        path: [...path, ...neighborPath],
                        totalCost: totalCost + neighborTotalCost,
                    })
                    break // Stop traversing in this neighborDirection
                }

                neighborCurrentNode = neighborNextNode
                neighborNextNode = getNextNode(neighborCurrentNode, neighborDirection)
            }
        }

        // Now, check if currentNode is goal or has forced neighbor in main direction
        if (currentNode === goal || hasForcedNeighbor(graph, currentNode, direction)) {
            // Found a jumpNode
            jumpResults.push({
                jumpNode: currentNode,
                path: [...path],
                totalCost: totalCost,
            })
            break // Stop traversing in main direction
        }

        // Proceed to next node in main direction
        const nextNode = getNextNode(currentNode, direction)
        if (nextNode && graph[nextNode]) {
            totalCost += graph[currentNode][nextNode]
            path.push(nextNode)
            currentNode = nextNode
        } else {
            break // No more nodes in main direction
        }
    }

    return jumpResults
}

export const findPath = ({ graph, start, goal, estimateFromNodeToGoal, getDirection, getNextNode }) => {
    let processedNodes = 0
    const distances = new Map()
    const heap = new Heap((a, b) => {
        const aData = distances.get(a)
        const bData = distances.get(b)
        return aData.fScore - bData.fScore
    })

    for (const node in graph) {
        distances.set(node, { cost: Infinity, fScore: Infinity, path: [] })
    }

    const startH = estimateFromNodeToGoal(start)
    distances.set(start, { cost: 0, fScore: startH, path: [start] })
    heap.push(start)

    while (!heap.isEmpty()) {
        const currentNode = heap.pop()
        if (!currentNode) continue
        if (currentNode === goal) break

        processedNodes++

        const { cost: currentCost, path: currentPath } = distances.get(currentNode)
        const neighbors = graph[currentNode]

        for (const neighbor in neighbors) {
            const direction = getDirection(currentNode, neighbor)

            const jumpResults = jump({
                graph,
                currentNode,
                direction,
                goal,
                getNextNode,
                getNeighborDirections,
                hasForcedNeighbor,
            })

            for (const { jumpNode, path: jumpPath, totalCost } of jumpResults) {
                const altCost = currentCost + totalCost
                const jumpNodeData = distances.get(jumpNode)

                if (altCost < jumpNodeData.cost) {
                    const jumpNodeH = estimateFromNodeToGoal(jumpNode)
                    const jumpNodeFScore = altCost + jumpNodeH
                    distances.set(jumpNode, {
                        cost: altCost,
                        fScore: jumpNodeFScore,
                        path: [...currentPath, ...jumpPath],
                    })
                    heap.push(jumpNode)
                }
            }
        }
    }

    const { path } = distances.get(goal)
    return { path, processedNodes }
}
