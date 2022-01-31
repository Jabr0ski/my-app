import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



function Square(props) {

  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

function getCoordinates(i) {
  let column = ''
  if (i % 3 === 0) {
    column = 'a'
  } else if (i % 3 === 1) {
    column = 'b';
  } else {
    column = 'c';
  };

  let row = Math.floor(i / 3) + 1

  let coordinate = column + row

  return (
    coordinate
  )
}




class Board extends React.Component {

  renderColumnCoordinate(i) {
    return(
      <div className="columncoordinate">
        {i}
      </div>
    )
  }

  renderRowCoordinate(i) {
    return(
      <div className="rowcoordinate">
        {i}
      </div>
    )
  }

  renderEmptySquare() {
    return(
      <div className="emptysquare">
      </div>
    )
  }

  renderSquare(i) {
    document.documentElement.style.setProperty('--custom-height', '4px');
    document.documentElement.style.setProperty('--custom-width', '4px');
    return (
    <Square 
    value={this.props.squares[i]} 
    onClick={() => this.props.onClick(i)}
    />
    );
  }

  render() {

    return (
      <div>
        <div>
          {this.renderEmptySquare()}
          {this.renderColumnCoordinate('a')}
          {this.renderColumnCoordinate('b')}
          {this.renderColumnCoordinate('c')}
        </div>
        <div className="board-row">
          {this.renderRowCoordinate('1')}
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderRowCoordinate('2')}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderRowCoordinate('3')}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      coordinates: [null],
      winners: ['']
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0,
      this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coordinates = this.state.coordinates.slice(0, 
      this.state.stepNumber + 1)
    const coordinate = getCoordinates(i)
    const winners = this.state.winners.slice(0, this.state.stepNumber + 1)
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const winner = calculateWinner(squares) ? ' (Game Over)' : ''

    this.setState({
      history: history.concat([{squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      coordinates: coordinates.concat([coordinate]),
      winners: winners.concat([winner])
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
    const coordinates = this.state.coordinates;
    const winners = this.state.winners

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' ' + coordinates[move] + winners[move]:
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' :
      'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


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
  for(let i = 0; i < lines.length; i++) {
    const[a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] ===
    squares[c]) {
      return squares[a];
    }
  }
  return null;
}