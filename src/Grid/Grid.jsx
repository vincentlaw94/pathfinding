import React from "react";
import "./Grid.css";
import Node from "./Node/Node";
import { dijkstra } from "../algorithms/dijkstra";
import { bfs, dfs } from "../algorithms/uninformedSearch";
import { astar } from "../algorithms/astar";
import {
  getNodesInShortestPathOrder,
  getAllNodes
} from "../algorithms/utility";
import NavigationBar from "../Header/NavigationBar.jsx";

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.keyEvent = React.createRef();
    this.state = {
      width: 50,
      height: 30,
      grid: [],
      mouseIsPressed: false,
      startIsPressed: false,
      finishIsPressed: false,

      wallWeightToggle: true, //wall=true, weight=false
      START_NODE_ROW: 10,
      START_NODE_COL: 15,
      FINISH_NODE_ROW: 10,
      FINISH_NODE_COL: 35
    };
  }

  componentDidMount() {
    const grid = initiateGrid();
    this.setState({ grid });
    this.keyEvent.current.addEventListener("keyup", this.handleKey);
    this.keyEvent.current.focus();
  }

  handleKey = e => {
    if (e.keyCode === 87) {
      this.setState({ wallWeightToggle: !this.state.wallWeightToggle });
    }
  };
  clearGrid() {
    const {
      width,
      height,
      START_NODE_COL,
      START_NODE_ROW,
      FINISH_NODE_COL,
      FINISH_NODE_ROW
    } = this.state;
    this.setState({ grid: [] });
    const newGrid = initiateGrid();
    this.setState({ grid: newGrid });

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        document.getElementById(`node-${row}-${col}`).className = "node";
      }

      document.getElementById(
        `node-${START_NODE_ROW}-${START_NODE_COL}`
      ).className = "node node-start";
      document.getElementById(
        `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
      ).className = "node node-finish";
    }
  }
  // mouse events: drag start/finish node, walls, and weights
  handleMouseDown(row, col, type) {
   
    if (type === "START") {
      this.setState({ startIsPressed: true });
    }
    if (type === "FINISH") {
      this.setState({ finishIsPressed: true });
    }
    if (type === "EMPTY" || type === "WEIGHT" || type === "WALL") {
      const newGrid = getNewGrid(
        this.state.grid,
        row,
        col,
        this.state.wallWeightToggle
      );
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (this.state.startIsPressed) {
      this.setState({ START_NODE_ROW: row, START_NODE_COL: col });
    }
    if (this.state.finishIsPressed) {
      this.setState({ FINISH_NODE_COL: col, FINISH_NODE_ROW: row });
    }
    if (this.state.mouseIsPressed) {
      const newGrid = getNewGrid(
        this.state.grid,
        row,
        col,
        this.state.wallWeightToggle
      );
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }
  handleMouseUp() {
    this.setState({
      mouseIsPressed: false,
      startIsPressed: false,
      finishIsPressed: false
    });
  }

  animatePathfinding(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (
          node.row === this.state.START_NODE_ROW &&
          node.col === this.state.START_NODE_COL
        ) {
          //do nothing
        } else if (
          node.row === this.state.FINISH_NODE_ROW &&
          node.col === this.state.FINISH_NODE_COL
        ) {
          //do nothing
        } else {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";}
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];

        if (
          node.row === this.state.START_NODE_ROW &&
          node.col === this.state.START_NODE_COL
        ) {
          //do nothing
        } else if (
          node.row === this.state.FINISH_NODE_ROW &&
          node.col === this.state.FINISH_NODE_COL
        ) {
          //do nothing
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }
      }, 50 * i);
    }
    document.getElementById(
      `node-${this.state.START_NODE_ROW}-${this.state.START_NODE_COL}`
    ).className = "node node-start";
    document.getElementById(
      `node-${this.state.FINISH_NODE_ROW}-${this.state.FINISH_NODE_COL}`
    ).className = "node node-finish";
  }

  pathfinding(pathfindAlgo, grid, startNode, finishNode) {
    switch (pathfindAlgo) {
      case "Dijkstra":
        const visitedNodesInOrderDijkstra = dijkstra(
          grid,
          startNode,
          finishNode
        );
        return visitedNodesInOrderDijkstra;
      //bfs, dfs, a* search
      case "BFS":
        const visitedNodesInOrderBfs = bfs(grid, startNode, finishNode);
        return visitedNodesInOrderBfs;

      case "DFS":
        const visitedNodesInOrderDfs = dfs(grid, startNode, finishNode);
        return visitedNodesInOrderDfs;

      case "A*":
        const visitedNodesInOrderAstar = astar(grid, startNode, finishNode);
        return visitedNodesInOrderAstar;

      default:
        const visitedNodesInOrder = bfs(grid, startNode, finishNode);
        return visitedNodesInOrder;
    }
  }

  visualizePathfinding(pathfindingAlgo) {
    const {
      width,
      height,
      grid,
      START_NODE_COL,
      START_NODE_ROW,
      FINISH_NODE_COL,
      FINISH_NODE_ROW
    } = this.state;

    const nodes = getAllNodes(grid);
    const wall = nodes.filter(node => node.isWall);
    const weight = nodes.filter(node => node.isWeight);

    const newGrid = initiateGrid();
    for (const node of wall) {
      node.previousNode = null;
      newGrid[node.row][node.col] = node;
    }
    for (const node of weight) {
      node.previousNode = null;
      newGrid[node.row][node.col] = node;
    }
    this.setState({ grid: newGrid });

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        document.getElementById(`node-${row}-${col}`).className = "node";
      }
    }
    document.getElementById(
      `node-${START_NODE_ROW}-${START_NODE_COL}`
    ).className = "node node-start";
    document.getElementById(
      `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
    ).className = "node node-finish";

    for (const node of wall) {
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-wall";
    }
    for (const node of weight) {
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-weight";
    }

    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = this.pathfinding(
      pathfindingAlgo,
      grid,
      startNode,
      finishNode
    );
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animatePathfinding(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const {
      grid,
      START_NODE_COL,
      START_NODE_ROW,
      FINISH_NODE_COL,
      FINISH_NODE_ROW
    } = this.state;

    return (
      <div>
        <NavigationBar
          onVisiualizePressed={e => this.visualizePathfinding(e)}
          onClearPathPressed={() => this.clearGrid()}
          wallWeightToggle={this.state.wallWeightToggle}
        />

        <div className="grid" tabIndex="0" ref={this.keyEvent}>
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isWall, isWeight } = node;
                  if (row === START_NODE_ROW && col === START_NODE_COL) {
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        onMouseDown={(row, col, type) =>
                          this.handleMouseDown(row, col, type)
                        }
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        isStart={true}
                        onMouseUp={() => this.handleMouseUp()}
                        type="START"
                        row={row}
                      />
                    );
                  }
                  if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        onMouseDown={(row, col, type) =>
                          this.handleMouseDown(row, col, type)
                        }
                        onMouseEnter={(row, col, type) =>
                          this.handleMouseEnter(row, col, type)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}
                        isFinish={true}
                        type="FINISH"
                      />
                    );
                  }
                  if (isWall) {
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        onMouseDown={(row, col, type) =>
                          this.handleMouseDown(row, col, type)
                        }
                        onMouseEnter={(row, col, type) =>
                          this.handleMouseEnter(row, col, type)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}
                        type="WALL"
                      />
                    );
                  }
                  if (isWeight) {
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        onMouseDown={(row, col, type) =>
                          this.handleMouseDown(row, col, type)
                        }
                        onMouseEnter={(row, col, type) =>
                          this.handleMouseEnter(row, col, type)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}
                        type="WEIGHT"
                      />
                    );
                  }
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      onMouseDown={(row, col, type) =>
                        this.handleMouseDown(row, col, type)
                      }
                      onMouseEnter={(row, col, type) =>
                        this.handleMouseEnter(row, col, type)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                      type="EMPTY"
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const initiateGrid = () => {
  const grid = [];
  for (let row = 0; row < 30; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    isWeight: false,
    previousNode: null,
    type: "EMPTY"
  };
};

const getNewGrid = (grid, row, col, wallWeight) => {
  if (wallWeight) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
      isWeight: false
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }
  if (!wallWeight) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: false,
      isWeight: !node.isWeight
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }
};

export default Grid;
