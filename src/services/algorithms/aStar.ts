import { Heap } from 'heap-js'

export const findPath = (
    graph: Record<string, Record<string, number>>,
    start: string,
    goal: string,
    estimateFromNodeToGoal: (currentNode: string) => number,
): { path: string[]; processedNodes: number } => {
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
            const altCost = currentCost + neighbors[neighbor]
            const neighborData = distances.get(neighbor)

            if (altCost < neighborData.cost) {
                const neighborH = estimateFromNodeToGoal(neighbor) // Евристика для сусіда
                const neighborFScore = altCost + neighborH
                distances.set(neighbor, { cost: altCost, fScore: neighborFScore, path: [...currentPath, neighbor] })
                heap.push(neighbor)
            }
        }
    }

    const { path } = distances.get(goal)
    return { path, processedNodes }
}
