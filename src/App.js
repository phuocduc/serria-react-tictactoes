import React, { useState } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(new Array(9).fill(null));
  const [isOver, setIsOver] = useState(false);
  const [winner, setWinner] = useState(null);
  console.log("from", isOver);

  const resetGame=()=>{
    setBoard(new Array(9).fill(null))
    setIsOver(false)
    setWinner(null)
  }
  return (
    <div className="App">
      <Board
        key={board}
        setWinner={setWinner}
        board={board}
        setBoard={setBoard}
        isOver={isOver}
        setIsOver={setIsOver}
      />
      <div>
        Game Info:
        {isOver ? (
          <span>
            {winner ? (
              <span>game is over, and the winner is {winner}</span>
            ) : (
              <span>game is over, it's a draw</span>
            )}
          </span>
        ) : (
          <span>Next player is {board.filter(el => !el).length % 2 ? "X" : "O"}</span>
        )}
      </div>
      <button onClick={()=>resetGame()}>Reset Game</button>
    </div>
  );
}

function Board(props) {
  const handleOnClick = id => {
    if (props.isOver) return;
    let board = props.board.slice();
    let check = board.filter(el => !el);
    // console.log('bard',!board[id])
    if (board[id] === null) board[id] = check.length % 2 ? "X" : "O";
    else return;

    if (board.filter(el => !el).length === 0) {
      props.setIsOver(true);
    }

    props.setBoard(board);
    console.log(decideOutCome(board));

    if(decideOutCome(board)){
      props.setWinner(decideOutCome(board))
      props.setIsOver(true)
    }
  };

  const decideOutCome = board => {
    const posibleWinCase = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2]
    ];

    for (let i = 0; i < posibleWinCase.length; i++) {
      let [a, b, c] = posibleWinCase[i];
      if (board[a] && board[a] == board[b] && board[a] == board[c])
        return board[a];
    }
    return null;
  };
  return (
    <div className="board">
      {props.board.map((el, idx) => {
        return (
          <Square
            key={idx}
            values={el}
            id={idx}
            handleOnClick={handleOnClick}
          />
        );
      })}
    </div>
  );
}

function Square(props) {
  return (
    <div className="square" onClick={() => props.handleOnClick(props.id)}>
      {props.values}
    </div>
  );
}

export default App;
