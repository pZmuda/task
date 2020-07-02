import React, { Component } from "react";
import Board from "./components/Board/index.js";
import BoardHead from "./components/BoardHead/index";
import Modal from "./components/Modal/index";
class App extends Component {
  constructor() {
    super();

    this.state = {
      gameStatus: "waiting", // can be running, waiting, or ended
      time: 0, // in seconds, will format later
      openCells: 0,
      treasure: 3,
      rows: 5,
      columns: 5,
      findTreasure: 0,
      name: "",
      score: "",
      isOpen: true,
    };

    this.baseState = this.state;
  }

  componentDidUpdate(nextProps, nextState) {
    if (this.state.gameStatus === "running") {
      this.checkForWinner();
    }
  }

  checkForWinner = () => {
    if (this.state.treasure === this.state.findTreasure) {
      this.setState(
        {
          gameStatus: "winner",
          score: this.state.time,
        },
        alert("you won!")
      );
    }
  };

  componentWillMount() {
    this.intervals = [];
  }

  setInterval = (fn, t) => {
    this.intervals.push(setInterval(fn, t));
  };

  reset = () => {
    this.intervals.map(clearInterval);
    this.setState(Object.assign({}, this.baseState), () => {
      this.intervals = [];
    });
  };

  tick = () => {
    if (this.state.openCells > 0 && this.state.gameStatus === "running") {
      let time = this.state.time + 1;
      this.setState({ time });
    }
  };

  endGame = () => {
    this.setState({
      findTreasure: this.state.findTreasure + 1,
    });
  };

  handleCellClick = () => {
    if (this.state.openCells === 0 && this.state.gameStatus !== "running") {
      this.setState(
        {
          gameStatus: "running",
        },
        this.setInterval(this.tick, 1000)
      );
    }
    this.setState((prevState) => {
      return { openCells: prevState.openCells + 1 };
    });
  };

  handleModalInput = (e) => {
    const name = e.target.value;
    this.setState({
      name,
    });
  };

  handleButtonName = () => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <div className="treasure-hunter">
        {this.state.isOpen ? (
          <Modal name={this.handleModalInput} addName={this.handleButtonName} />
        ) : (
          <>
            <h1>Treasure hunter</h1>
            <p>{this.state.name}</p>
            <BoardHead
              time={this.state.time}
              flagsUsed={this.state.findTreasure}
              reset={this.reset}
              status={this.state.gameStatus}
            />
            <Board
              openCells={this.state.openCells}
              treasure={this.state.treasure}
              rows={this.state.rows}
              columns={this.state.columns}
              endGame={this.endGame}
              status={this.state.gameStatus}
              onCellClick={this.handleCellClick}
            />
          </>
        )}
      </div>
    );
  }
}
export default App;
