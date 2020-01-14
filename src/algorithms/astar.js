import { getUnvisitedNeighbors, getAllNodes } from "./utility";

// astar with manhattan distance heuristic

export function astar(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    
    const unvisitedNodes = getAllNodes(grid);
    startNode.distance = 0 
    while(unvisitedNodes.length){
        sortNodeByCost(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()
        if (closestNode.isWall) continue
        if (closestNode.distance === Infinity) return visitedNodesInOrder
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode)
        if (closestNode===finishNode) return visitedNodesInOrder
        updateUnvisitedNeighbors(closestNode, finishNode, grid)
    }
}

function sortNodeByCost(unvisitedNodes){
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

function updateUnvisitedNeighbors(node, finishNode, grid){
    const unvisitedNeighbors = getUnvisitedNeighbors(node,grid)
    for (const neighbor of unvisitedNeighbors){
        const mdCost = manhantanDisance(neighbor, finishNode)
        neighbor.distance = neighbor.isWeight? node.distance + 2 + mdCost :node.distance + 1 + mdCost
        
        
        neighbor.previousNode = node
    }
}

function manhantanDisance(node, finishNode){
    return Math.abs(finishNode.row - node.row) + Math.abs(finishNode.col - node.col)
}