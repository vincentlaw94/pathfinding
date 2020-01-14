import React, { Component } from "react";
import {
  Container,
  Message,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Button,
  Segment
} from "semantic-ui-react";
import Node from "../Grid/Node/Node.jsx";
export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathfindingAlgo: ""
    };
  }

  visualizedPress() {
    if (this.state.pathfindingAlgo === "") {
      alert("Please select pathfinding algorithm first.");
    } else {
      this.props.onVisiualizePressed(this.state.pathfindingAlgo);
    }
  }
  render() {
    const { fixed } = this.state;
    const { onClearPathPressed, wallWeightToggle } = this.props;
    return (
      <div>
        <Menu fixed="top" inverted style={{ backgroundColor: "#061830" }}>
          <Container>
            <Menu.Item as="a" header>
              <Image size="mini" style={{ marginRight: "1.5em" }} />
              Pathfinding Visualizer
            </Menu.Item>

            <Dropdown item text={"Algorithm"}>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => this.setState({ pathfindingAlgo: "DFS" })}
                >
                  Depth First Search
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => this.setState({ pathfindingAlgo: "BFS" })}
                >
                  Breath First Search
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => this.setState({ pathfindingAlgo: "Dijkstra" })}
                >
                  Dijkstra
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => this.setState({ pathfindingAlgo: "A*" })}
                >
                  A* Search
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown item text="Generate Maze">
              <Dropdown.Menu>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item position="right">
              <Button
                color="blue"
                style={{ marginRight: 16 }}
                onClick={() => this.visualizedPress()}
              >
                Visualize {this.state.pathfindingAlgo}!
              </Button>
              <Button onClick={() => onClearPathPressed()}>Clear Grid</Button>
            </Menu.Item>
          </Container>
        </Menu>
        <Container style={{ margin: 50 }}>
          <List horizontal>
            <List.Item>
              <Node
                onMouseDown={() =>{}}
                onMouseEnter={()=>{}}
                onMouseUp={() => {}}
                type="START"
              />
              Start Node
            </List.Item>
            <List.Item>
              <Node
                onMouseDown={() =>{}}
                onMouseEnter={()=>{}}
                onMouseUp={() => {}}
                type="FINISH"
              />
              Finish Node
            </List.Item>
            <List.Item>
            <Node
                onMouseDown={() =>{}}
                onMouseEnter={()=>{}}
                onMouseUp={() => {}}
                type="WEIGHT"
              />
              Weight Node
            </List.Item>
            <List.Item>
            <Node
                onMouseDown={() =>{}}
                onMouseEnter={()=>{}}
                onMouseUp={() => {}}
                type="WALL"
              />
              Wall Node
            </List.Item>
          </List>
        </Container>
        <Message
          header="Press w to toggle between wall and weight"
          content={wallWeightToggle ? "Wall" : "Weight"}
        />
      </div>
    );
  }
}
