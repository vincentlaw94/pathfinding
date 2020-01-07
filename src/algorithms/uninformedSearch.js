//dfs, bfs 
import {getUnvisitedNeighbors} from './utility'

export function bfs(grid,startNode,finishNode){
    const visitedNodesInOrder = [];
    const queue = [];
    const explored = new Set()
    queue.push(startNode)
    
    while (queue.length){
        const currentNode = queue.shift()
        if (currentNode.isWall || explored.has(currentNode)) continue;
        currentNode.isVisited  = true;
        visitedNodesInOrder.push(currentNode);
        if (currentNode === finishNode) return visitedNodesInOrder;
        explored.add(currentNode)
        const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid)
        for (const neighbor of unvisitedNeighbors){
            neighbor.previousNode = currentNode 
            queue.push(neighbor)
        }
    }
}

export function dfs(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    const stack = [];
    const explored = new Set();
    stack.push(startNode)
    while(stack.length){
        const currentNode = stack.pop()
        if (currentNode.isWall || explored.has(currentNode)) continue;
        visitedNodesInOrder.push(currentNode)
        currentNode.isVisited = true
        if(currentNode === finishNode) return visitedNodesInOrder
        explored.add(currentNode)
        const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid)
        for (const neighbor of unvisitedNeighbors){
            neighbor.previousNode = currentNode
            stack.push(neighbor)
        }
    }
}

