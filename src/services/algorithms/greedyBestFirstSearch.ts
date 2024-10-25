import { Heap } from 'heap-js'

export const findPath = (
    graph: Record<string, Record<string, number>>,
    start: string,
    goal: string,
    estimateFromNodeToGoal: (currentNode: string) => number,
): { path: string[]; processedNodes: number } => {
    let processedNodes = 0
    const cameFrom = new Map<string, string>()
    const visited = new Set<string>()
    const heap = new Heap<string>((a, b) => {
        const aH = estimateFromNodeToGoal(a)
        const bH = estimateFromNodeToGoal(b)
        return aH - bH
    })

    heap.push(start)

    while (!heap.isEmpty()) {
        const currentNode = heap.pop()
        if (!currentNode) continue

        if (currentNode === goal) {
            const path: string[] = []
            let node = goal
            while (node !== start) {
                path.push(node)
                node = cameFrom.get(node) || ''
            }
            path.push(start)
            path.reverse()
            return { path, processedNodes }
        }

        if (visited.has(currentNode)) continue
        visited.add(currentNode)
        processedNodes++

        const neighbors = graph[currentNode]
        for (const neighbor in neighbors) {
            const weight = neighbors[neighbor]

            if (weight === Infinity || visited.has(neighbor)) {
                continue
            }

            if (!visited.has(neighbor)) {
                cameFrom.set(neighbor, currentNode)
                heap.push(neighbor)
            }
        }
    }

    // Якщо шлях не знайдено
    return { path: [], processedNodes }
}
