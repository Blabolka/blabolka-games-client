import { Heap } from 'heap-js'

export const findAllPaths = (
    graph: Record<string, Record<string, number>>,
    start: string,
): { paths: Record<string, { path: string[]; cost: number }>; processedNodes: number } => {
    let processedNodes = 0
    const distances = new Map()
    const paths: Record<string, { path: string[]; cost: number }> = {}
    const heap = new Heap<string>((a, b) => distances.get(a).cost - distances.get(b).cost)

    for (const node in graph) {
        distances.set(node, { cost: Infinity, path: [] })
    }
    distances.set(start, { cost: 0, path: [start] })
    heap.push(start)

    while (!heap.isEmpty()) {
        const currentNode = heap.pop()
        if (!currentNode) continue

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

    for (const [node, { cost, path }] of Array.from(distances.entries())) {
        paths[node] = { path, cost }
    }

    return { paths, processedNodes }
}
