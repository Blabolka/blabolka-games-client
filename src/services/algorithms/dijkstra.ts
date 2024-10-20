import { Heap } from 'heap-js'

export const findPath = (
    graph: Record<string, Record<string, number>>,
    start: string,
    goal: string,
): { path: string[]; processedNodes: number } => {
    let processedNodes = 0
    const distances = new Map()
    const heap = new Heap<string>((a, b) => distances.get(a).cost - distances.get(b).cost)

    for (const node in graph) {
        distances.set(node, { cost: Infinity, path: [] })
    }

    distances.set(start, { cost: 0, path: [start] })
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
            if (altCost < distances.get(neighbor).cost) {
                distances.set(neighbor, { cost: altCost, path: [...currentPath, neighbor] })
                heap.push(neighbor)
            }
        }
    }

    const { path } = distances.get(goal)
    return { path, processedNodes }
}
