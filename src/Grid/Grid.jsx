import React from 'react'
import './Grid.css'
import Node from './Node/Node'

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
        }
    }

    
    componentDidMount(){
        const grid = initiateGrid()
        this.setState({grid})
    }

    // onClick and hold draw walls and add weights 
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
    
    

    render(){
        const {grid, mouseIsPressed} = this.state;
        return (
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

        )
           
    }
}

const initiateGrid = () =>  {
    const grid = [];
    for (let row = 0; row < 15; row++){
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