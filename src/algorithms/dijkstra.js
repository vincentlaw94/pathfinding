//perform dijkstra algo
//use priority queue for the shortest distance 
import {getAllNodes, getUnvisitedNeighbors} from './utility'


export function dijkstra(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    startNode.distance = 0; 
    const unvisitedNodes = getAllNodes(grid);
    while(unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true; 
        visitedNodesInOrder.push(closestNode)
        if (closestNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode, grid)
     }
}

function sortNodesByDistance(unvisitedNodes){
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

function updateUnvisitedNeighbors(node, grid){
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid)
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = neighbor.isWeight? node.distance + 2  :node.distance + 1 
        neighbor.previousNode = node
    }
}





