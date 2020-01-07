import React from 'react'
import './Grid.css'
import Node from './Node/Node'
import {dijkstra} from '../algorithms/dijkstra'
import {bfs, dfs} from '../algorithms/uninformedSearch'
import {astar} from '../algorithms/astar'
import {getNodesInShortestPathOrder} from '../algorithms/utility'

//start and finish position
const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10; 
const FINISH_NODE_COL = 35; 


class Grid extends React.Component{

    constructor(props){
        super(props);
        this.state={
            grid:[],
            mouseIsPressed: false, 
            pathfindingAlgo: "astar", 
        }
    }

    
    componentDidMount(){
        const grid = initiateGrid()
        this.setState({grid})
    }
    clearGrid(){
        const grid = initiateGrid()
        
        this.setState({grid})
    }
    // mouse events: dnpm start raw walls and add weights 
    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true})
    }

    handleMouseEnter(row,col){
        if(!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid})
        
    }
    handleMouseUp(){
        this.setState({mouseIsPressed: false})
    }
    animatePathfinding(visitedNodesInOrder, nodesInShortestPathOrder){
        for (let i = 0; i <= visitedNodesInOrder.length; i++){
            if (i===visitedNodesInOrder.length){
                setTimeout(()=>{
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i)
                return;
                }
                setTimeout(()=>{
                    const node = visitedNodesInOrder[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node-visited';
                }, 10*i);
                }
    }
    
    animateShortestPath(nodesInShortestPathOrder){
        for (let i = 0; i < nodesInShortestPathOrder.length; i++){
            setTimeout(()=> {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 
                    'node node-shortest-path';}, 50*i);
            }
        }
    
        
    pathfinding(pathfindAlgo, grid, startNode, finishNode){
        switch(pathfindAlgo){
            case "dijkstra":
                const visitedNodesInOrderDijkstra = dijkstra(grid,startNode, finishNode)
                return visitedNodesInOrderDijkstra
            //bfs, dfs, a* search 
            case "bfs":
                const visitedNodesInOrderBfs = bfs(grid, startNode, finishNode)
                return visitedNodesInOrderBfs

            case "dfs":
                const visitedNodesInOrderDfs = dfs(grid, startNode, finishNode)
                return visitedNodesInOrderDfs
            
            case "astar":
                const visitedNodesInOrderAstar = astar(grid, startNode, finishNode)
                return visitedNodesInOrderAstar
            
            default:
                const visitedNodesInOrder = bfs(grid, startNode, finishNode)
                return visitedNodesInOrder


        }
    }

    visualizePathfinding() {
        const {grid} = this.state;
        const {pathfindingAlgo} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = this.pathfinding(pathfindingAlgo, grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animatePathfinding(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    render(){
        const {grid, mouseIsPressed} = this.state;
        return (
            
            <div>
                <button onClick= {()=> this.visualizePathfinding()}> Find shortest path </button>
                <button onClick = {()=> this.clearGrid()}>Clear</button>
            
            
            <div className="grid">
                {grid.map((row,rowIdx) => {
                    return (
                        <div key={rowIdx}>
                            {row.map((node,nodeIdx) =>{
                                const {row, col, isFinish, isStart, isWall} = node;
                                return(
                                    <Node
                                        key={nodeIdx}
                                        col = {col}
                                        isFinish = {isFinish}
                                        isStart = {isStart}
                                        isWall = {isWall}
                                        mouseIspressed = { mouseIsPressed}
                                        onMouseDown = {(row,col)=>{ this.handleMouseDown(row, col)}}
                                        onMouseEnter = {(row,col)=>{this.handleMouseEnter(row,col)}}
                                        onMouseUp = {()=>this.handleMouseUp()}
                                        row = {row}
                                        />
                                )
                            })}
                        </div>
                            
                    )
                })}
            </div>
            </div>

        )
           
    }
}

const initiateGrid = () =>  {
    const grid = [];
    for (let row = 0; row < 30; row++){
        const currentRow = [];
        for (let col = 0; col < 50; col++){
            currentRow.push(createNode(row,col));
        }
        grid.push(currentRow);
    }
    return grid
}

const createNode = (row, col) => {
    return {
        row, 
        col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL, 
        distance: Infinity, 
        isVisited: false, 
        isWall: false,
        previousNode: null
    }
}

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ... node,
        isWall:!node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid; 

}

export default Grid;