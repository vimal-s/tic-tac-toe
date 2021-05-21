import React from "react";
import Board from "./Board.js";

function calculateWinner(squares) {
  let winningIndices = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningIndices.length; i++) {
    const [a, b, c] = winningIndices[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          markedIndex: null,
        },
      ],
      xIsNext: true, // 'X' is the first player
      currentBoardIndex: 0,
    };
  }

  handleClick(squareIndex) {
    const currentBoardIndex = this.state.currentBoardIndex;
    const newHistory = this.state.history.slice(0, currentBoardIndex + 1);

    if (
      newHistory[currentBoardIndex].squares[squareIndex] ||
      calculateWinner(newHistory[currentBoardIndex].squares)
    ) {
      // do not proceed further. Because either square is already used or winner is found.
      return;
    }

    // todo: why slice here, why not working without slice strange behaviour
    // i think this has to do with rendering in react may.....be...
    const newSquares = newHistory[currentBoardIndex].squares.slice();

    newSquares[squareIndex] = this.state.xIsNext ? "X" : "O";
    this.setState({
      // todo: see if you want to keep previous history
      // one idea is to use array of array instead of array for the state history
      history: newHistory.concat([
        { squares: newSquares, markedIndex: squareIndex },
      ]),
      currentBoardIndex: currentBoardIndex + 1,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      currentBoardIndex: step,
      xIsNext: step % 2 === 0 ? true : false,
    });
  }

  getMoves() {
    let history = this.state.history;

    // only show the latest move when player is not already on it
    let showLatest;
    if (history.length > this.state.currentBoardIndex + 1) {
      showLatest = true;
    } else {
      history = history.slice(0, history.length - 1);
    }

    return history.map((currHistory, index) => {
      // todo: make this a separate function
      let coordinate =
        "(" +
        parseInt(currHistory.markedIndex / 3, 10) +
        "," +
        (currHistory.markedIndex % 3) +
        ")";

      // todo: make this a separate function
      let message = "Go back to start";
      if (index !== 0) {
        message = "Go back to move: " + index + ", coord: " + coordinate;
        if (showLatest && index === history.length - 1) {
          message = "Go to latest move: " + index + ", coord: " + coordinate;
        }
      }

      return (
        <li key={message}>
          <button
            className="game-moves"
            id={index}
            style={{
              // borderRadius: "5px",
              // last element is always bold but it's fine cause element is not shown on screen
              fontWeight:
                index === this.state.currentBoardIndex ? "bold" : "normal",
            }}
            onClick={() => this.jumpTo(index)}
          >
            {message}
          </button>
        </li>
      );
    });
  }

  render() {
    const currentBoardIndex = this.state.currentBoardIndex;
    const squares = this.state.history[currentBoardIndex].squares;
    const winningIndices = calculateWinner(squares);

    let status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    if (winningIndices) {
      status = "Winner: " + squares[winningIndices[0]];
    } else if (currentBoardIndex === 9) {
      // to keep it simple we are only checking for when board gets full
      status = "Match Draw";
    }

    return (
      <div className="game">
        <div>
          <div>{status}</div>
          <div className="game-board">
            <Board
              winningIndices={winningIndices}
              squares={squares}
              onClick={(squareIndex) => this.handleClick(squareIndex)}
            />
          </div>
        </div>
        <div className="game-info">
          Previous steps
          <ul>{this.getMoves()}</ul>
        </div>
      </div>
    );
  }
}

export default Game;
