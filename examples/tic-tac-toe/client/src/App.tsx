import React from 'react';
import './App.css';

enum Player { 
  X = 'X',
  O = 'O',
}

function Square({ player, onClick}: { player: (Player | null), onClick: () => {}}) {
  return <div className='square' onClick={onClick}>{player ?? ''}</div>
}

function Board() {
  const squares = new Array(9).fill(null);
  const currentPlayer = Player.X;

  return <div>
    <div className='row'>
      <Square player={squares[0]} onClick={() => squares[0] = currentPlayer}></Square>
      <Square player={squares[1]} onClick={() => squares[1] = currentPlayer}></Square>
      <Square player={squares[2]} onClick={() => squares[2] = currentPlayer}></Square>
    </div>
    <div className='row'>
      <Square player={squares[3]} onClick={() => squares[3] = currentPlayer}></Square>
      <Square player={squares[4]} onClick={() => squares[4] = currentPlayer}></Square>
      <Square player={squares[5]} onClick={() => squares[5] = currentPlayer}></Square>
    </div>
    <div className='row'>
      <Square player={squares[6]} onClick={() => squares[6] = currentPlayer}></Square>
      <Square player={squares[7]} onClick={() => squares[7] = currentPlayer}></Square>
      <Square player={squares[8]} onClick={() => squares[8] = currentPlayer}></Square>
    </div>
  </div>
}

function Game() {
  return <div>
    <Board/>
  </div>
}


function App() {
  return (
    <Game></Game>
  );
}

export default App;
