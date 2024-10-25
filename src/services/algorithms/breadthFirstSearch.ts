export const findPath = (
    graph: Record<string, Record<string, number>>,
    start: string,
    goal: string,
): { path: string[]; processedNodes: number } => {
    let processedNodes = 0
    const cameFrom = new Map<string, string>()
    const visited = new Set<string>()
    const queue = [start]

    while (queue.length > 0) {
        const currentNode = queue.shift()
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

            cameFrom.set(neighbor, currentNode)
            queue.push(neighbor)
        }
    }

    // Якщо шлях не знайдено
    return { path: [], processedNodes }
}
