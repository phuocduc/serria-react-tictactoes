import React, { useState, useEffect } from "react";
// import ReactDom from 'react-doms'
import FacebookLogin from "react-facebook-login";
import "./App.css";

function App() {
  const [board, setBoard] = useState(new Array(9).fill(null));
  const [isOver, setIsOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [topScore, setTopScore] = useState(null);

  const resetGame = () => {
    setBoard(new Array(9).fill(null));
    setIsOver(false);
    setWinner(null);
  };
  const getData = async () => {
    const response = await fetch(
      `https://ftw-highscores.herokuapp.com/tictactoe-dev`
    );
    const data = await response.json();

    setTopScore(data.items);
  };

  const postData = async () => {
    let data = new URLSearchParams();
    data.append("player", "Hello World");
    data.append("score", -Infinity);
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data.toString(),
      json:true
    });
    const resp = await response.json()
    console.log('resp',resp)

    getData()
  };

  useEffect(() => {
    getData();
  }, []);

  const responseFacebook = resp => {
    // console.log("hehe", resp);
    setCurrentUser({ name: resp.name, email: resp.email });
  };

  return (
    <div className="App">
      {!currentUser ? (
        <FacebookLogin
          autoLoad={true}
          appId="901794383532960"
          fields="name,email,picture"
          callback={resp => responseFacebook(resp)}
        />
      ) : (
        <div></div>
      )}

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
          <span>
            Next player is {board.filter(el => !el).length % 2 ? "X" : "O"}
          </span>
        )}
      </div>
      <button onClick={() => resetGame()}>Reset Game</button>

      <h1>History</h1>
      <div>
        {topScore &&
          topScore.map(el => {
            return (
              <div>
                name: {el.player} Score: {el.score}
              </div>
            );
          })}
      </div>
      <button onClick={()=>postData()}>Up up</button>
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

    if (decideOutCome(board)) {
      props.setWinner(decideOutCome(board));
      props.setIsOver(true);
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
