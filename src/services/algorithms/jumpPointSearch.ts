import { Heap } from 'heap-js'

type IsJumpPointParams = {
    graph: Record<string, Record<string, number>>
    node: string
    direction: string
    getNextNode: (currentNode: string, direction: string) => string | undefined
}

type JumpParams = {
    graph: Record<string, Record<string, number>>
    currentNode: string
    direction: string
    goal: string
    getNextNode: (currentNode: string, direction: string) => string | undefined
}

type AlgorithmParams = {
    graph: Record<string, Record<string, number>>
    start: string
    goal: string
    estimateFromNodeToGoal: (currentNode: string) => number
    getDirection: (fromNode: string, toNode: string) => string
    getNextNode: (currentNode: string, direction: string) => string | undefined
}

const isJumpPoint = ({ graph, node, direction, getNextNode }: IsJumpPointParams): boolean => {
    const neighbors = graph[node]
    if (!neighbors) return false

    const weights = Object.values(neighbors)
    if (weights.length < 2) return false

    const nextNodeAfterCurrent = getNextNode(node, direction)
    if (nextNodeAfterCurrent && !graph[nextNodeAfterCurrent]) return true

    return weights.some((weight) => weight !== weights[0])
}

const jump = ({
    graph,
    currentNode,
    goal,
    direction,
    getNextNode,
}: JumpParams): { jumpNode: string | null; path: string[]; totalCost: number } => {
    let totalCost = 0
    const path: string[] = []

    let nextNode = getNextNode(currentNode, direction)

    while (nextNode && graph[nextNode]) {
        totalCost += graph[currentNode][nextNode]
        path.push(nextNode)

        if (nextNode === goal || isJumpPoint({ graph, node: nextNode, direction, getNextNode })) {
            return { jumpNode: nextNode, path, totalCost }
        }

        currentNode = nextNode
        nextNode = getNextNode(currentNode, direction)
    }

    return { jumpNode: null, path, totalCost }
}

export const findPath = ({
    graph,
    start,
    goal,
    estimateFromNodeToGoal,
    getDirection,
    getNextNode,
}: AlgorithmParams): {
    path: string[]
    processedNodes: number
} => {
    let processedNodes = 0
    const distances = new Map()
    const heap = new Heap<string>((a, b) => {
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

            const { jumpNode, path: jumpPath, totalCost } = jump({ graph, currentNode, direction, goal, getNextNode })

            if (jumpNode) {
                const altCost = currentCost + totalCost
                const jumpNodeData = distances.get(jumpNode)

                if (altCost < jumpNodeData.cost) {
                    const jumpNodeH = estimateFromNodeToGoal(jumpNode) // Евристична функція
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
