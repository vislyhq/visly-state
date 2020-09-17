import React from 'react'
import { state, useValue, useMutation } from '@visly/state'
import './App.css'

enum Player { 
  X = 'X',
  O = 'O',
}

const emptyBoard = new Array(9).fill(null)
const gameState = state({
  board: emptyBoard,
  currentPlayer: Player.O,
})

const mutations = {
  playSquare: (state: any, index: number, player: Player) => {
      state.board[index] = player
  },
  alternatePlayer: (state: any) => {
    state.currentPlayer = state.currentPlayer === Player.X ? Player.O : Player.X
  }
}

function Square({ player, onClick}: { player: (Player | null), onClick: () => void}) {
  return <div className='square' onClick={onClick}>{player ?? ''}</div>
}

function Board() {

  const makeMove = useMutation(gameState, mutations.playSquare)

  const board = useValue(gameState, s => s.board)
  const currentPlayer = Player.X

  return <div>
    <div className='row'>
      <Square player={board[0]} onClick={() => makeMove(0, currentPlayer)}></Square>
      <Square player={board[1]} onClick={() => makeMove(1, currentPlayer)}></Square>
      <Square player={board[2]} onClick={() => makeMove(2, currentPlayer)}></Square>
    </div>
    <div className='row'>
      <Square player={board[3]} onClick={() => makeMove(3, currentPlayer)}></Square>
      <Square player={board[4]} onClick={() => makeMove(4, currentPlayer)}></Square>
      <Square player={board[5]} onClick={() => makeMove(5, currentPlayer)}></Square>
    </div>
    <div className='row'>
      <Square player={board[6]} onClick={() => makeMove(6, currentPlayer)}></Square>
      <Square player={board[7]} onClick={() => makeMove(7, currentPlayer)}></Square>
      <Square player={board[8]} onClick={() => makeMove(8, currentPlayer)}></Square>
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
  )
}

export default App
