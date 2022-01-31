import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function coordinatesCalc(i){
  if(i % 3 === 0 ){
    return ('a' + (Math.floor(i/3)+1))
  } else if (i % 3 === 1){
    return ('b' + (Math.floor(i/3)+1))
  } else {
    return ('c' + (Math.floor(i/3)+1))
  }
}

class Board extends React.Component {
  
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderCoordinate(t, c){
    return (
      <div className = {t}>
        {c}
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderCoordinate('cornerCoordinate', null)}
          {this.renderCoordinate('rowCoordinate', 'A')}
          {this.renderCoordinate('rowCoordinate', 'B')}
          {this.renderCoordinate('rowCoordinate', 'C')}
        </div>
        <div className="board-row">
          {this.renderCoordinate('columnCoordinate', '1')}
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderCoordinate('columnCoordinate', '2')}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderCoordinate('columnCoordinate', '3')}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      coordinates: [null],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coordinates = this.state.coordinates.slice(0, this.state.stepNumber + 1);
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const coordinate = coordinatesCalc(i);
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      coordinates: coordinates.concat([
        coordinate
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move + " " + this.state.coordinates[move]:
      'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });
    let status;
    if (winner) {
      status = 'Winner ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          <ol>
            {
              this.state.coordinates.slice(1).map((i) => (
                  <li key={i}>{this.state.coordinates.indexOf(i) % 2 ? 'X' : 'O'} in {i}</li>
              ))
            }
          </ol>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);