import React from "react";

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={props.shouldHighlight ? { background: "red" } : undefined}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let shouldHighlight =
      this.props.winningIndices && this.props.winningIndices.includes(i);

    return (
      <Square
        shouldHighlight={shouldHighlight}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      let startIndex = i * 3;
      for (let j = startIndex; j < startIndex + 3; j++) {
        row.push(this.renderSquare(j));
      }

      board.push(<div className="board-row">{row}</div>);
    }

    return <div>{board}</div>;
  }
}

export default Board;
