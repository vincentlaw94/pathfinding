import React from "react";
import "./Node.css";

class Node extends React.Component {
  

  render() {
    const { col, row, type, onMouseDown, onMouseEnter, onMouseUp } = this.props;

    function extraClassName(type) {
      switch (type) {
        case "START":
          return "node-start";
        case "FINISH":
          return "node-finish";
        case "WALL":
          return "node-wall";
        case "WEIGHT":
            return "node-weight"
        default:
          return "";
      }
    }

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName(type)}`}
        onMouseDown={() => onMouseDown(row, col, type)}
        onMouseEnter={() => onMouseEnter(row, col, type)}
        onMouseUp={() => onMouseUp()}
        
      />
    );
  }
}

export default Node;
