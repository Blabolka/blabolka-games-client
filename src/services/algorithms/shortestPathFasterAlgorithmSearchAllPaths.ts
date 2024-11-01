export const findAllPaths = (
    graph: Record<string, Record<string, number>>,
    start: string,
): { paths: Record<string, { path: string[]; cost: number }>; processedNodes: number } => {
    let processedNodes = 0
    const paths: Record<string, { path: string[]; cost: number }> = {}
    const queue: string[] = [start]

    paths[start] = { path: [start], cost: 0 }

    while (queue.length > 0) {
        const currentNode = queue.shift()
        if (!currentNode) continue

        processedNodes++

        const { path: currentPath, cost: currentCost } = paths[currentNode]
        const neighbors = graph[currentNode]

        for (const neighbor in neighbors) {
            const weight = neighbors[neighbor]
            if (weight === Infinity) {
                continue
            }

            const newCost = currentCost + weight

            if (!(neighbor in paths) || newCost < paths[neighbor].cost) {
                paths[neighbor] = { path: [...currentPath, neighbor], cost: newCost }
                queue.push(neighbor)
            }
        }
    }

    return { paths, processedNodes }
}
