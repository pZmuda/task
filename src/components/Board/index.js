import React, { Component } from "react";
import Row from "../Row";

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: this.createBoard(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.openCells > nextProps.openCells ||
      this.props.columns !== nextProps.columns
    ) {
      this.setState({
        rows: this.createBoard(nextProps),
      });
    }
  }

  createBoard = (props) => {
    // create 2d grid for our board based off the number of columns and rows passed in from props
    let board = [];
    for (let i = 0; i < props.rows; i++) {
      board.push([]);
      for (let j = 0; j < props.columns; j++) {
        board[i].push({
          x: j,
          y: i,
          count: 0,
          isOpen: false,
          treasure: false,
          hasFlag: false,
        });
      }
    }
    for (let i = 0; i < props.treasure; i++) {
      let randomRow = Math.floor(Math.random() * props.rows);
      let randomCol = Math.floor(Math.random() * props.columns);

      let cell = board[randomRow][randomCol];

      if (cell.treasure) {
        i--;
      } else {
        cell.treasure = true;
      }
    }
    return board;
  };



  open = (cell) => {
    if (this.props.status === "ended") {
      return;
    }
    let asyncCountTreasure = new Promise((resolve) => {
      let treasure = this.findTreasure(cell);
      resolve(treasure);
    });

    asyncCountTreasure.then((numberOfTreasure) => {
      let rows = this.state.rows;

      let current = rows[cell.y][cell.x];

      if (current.treasure && this.props.openCells === 0) {
        let newRows = this.createBoard(this.props);
        this.setState({ rows: newRows }, () => {
          this.open(cell);
        });
      } else {
        if (!cell.hasFlag && !current.isOpen) {
          this.props.onCellClick();

          current.isOpen = true;
          current.count = numberOfTreasure;

          this.setState({ rows });
          // now that we know its not a flag and its not a BOMB we should try to open cells around it!
          if (!current.treasure && numberOfTreasure === 0) {
            this.openAroundCell(cell);
          }

          if (current.treasure && this.props.openCells !== 0) {
            this.props.endGame();
          }
        }
      }
    });
  };

  findTreasure = (cell) => {
    let treasureInProximity = 1;
    for (let row = -1; row <= 1; row++) {
      
      for (let col = -1; col <= 1; col++) {
        if (cell.y + row >= 0 && cell.x + col >= 0) {
          if (
            cell.y + row < this.state.rows.length &&
            cell.x + col < this.state.rows[0].length
          ) {
            if (
              this.state.rows[cell.y + row][cell.x + col].treasure &&
              !(row === 0 && col === 0)
            ) {
              console.log('row ', row);
              console.log('col ', col);
              console.log('row + col ', row + col);
              if (row + col === 1 || row + col === -1) {
                treasureInProximity = 3;
              } else if (
                row + col === 2 ||
                row + col === -2 ||
                row + col === 0
              ) {
                treasureInProximity = 2;
              }
            } 
          }
        }
      }
    }
    return treasureInProximity;
  };

  openAroundCell = (cell) => {
    let rows = this.state.rows;

    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        if (cell.y + row >= 0 && cell.x + col >= 0) {
          if (
            cell.y + row < this.state.rows.length &&
            cell.x + col < this.state.rows[0].length
          ) {
            if (
              !this.state.rows[cell.y + row][cell.x + col].treasure &&
              !rows[cell.y + row][cell.x + col].isOpen
            ) {
              this.open(rows[cell.y + row][cell.x + col]);
            }
          }
        }
      }
    }
  };

  render() {
    let rows = this.state.rows.map((cells, index) => (
      <Row cells={cells} open={this.open} flag={this.flag} key={index} />
    ));
    return <div className="board">{rows}</div>;
  }
}

export default Board;
