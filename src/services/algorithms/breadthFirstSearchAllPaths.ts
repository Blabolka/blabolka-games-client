export const findAllPaths = (
    graph: Record<string, string[]>,
    start: string,
): { paths: Record<string, { path: string[]; cost: number }>; processedNodes: number } => {
    let processedNodes = 0
    const paths: Record<string, { path: string[]; cost: number }> = {}
    const queue: string[] = [start]
    const visited: Set<string> = new Set()

    paths[start] = { path: [start], cost: 0 }
    visited.add(start)

    while (queue.length > 0) {
        const currentNode = queue.shift()
        if (!currentNode) continue

        processedNodes++

        const { path: currentPath, cost: currentCost } = paths[currentNode]
        const neighbors = graph[currentNode]

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor)
                paths[neighbor] = {
                    path: [...currentPath, neighbor],
                    cost: currentCost + 1,
                }
                queue.push(neighbor)
            }
        }
    }

    return { paths, processedNodes }
}
