import React from 'react'
import {state, useValue, useMutation} from '@visly/state'
import nought from './assets/nought.svg'
import cross from './assets/cross.svg'
import './App.css'

enum Player {
  X = 'X',
  O = 'O',
}

type Board = Array<null | Player>

interface State {
  board: Board
  currentPlayer: Player
  winner: null | Player
}

const emptyBoard: Board = new Array(9).fill(null)

const initialState: State = {
  board: emptyBoard,
  currentPlayer: Player.O,
  winner: null,
}

const gameState = state<State>(initialState)

const checkWinner = (board: Board): null | Player => {
  // check horizontally
  for (let i = 0; i < 3; i++) {
    if (board[i * 3] === board[i * 3 + 1] && board[i * 3] === board[i * 3 + 2]) {
      return board[i * 3]
    }
  }

  // check vertically
  for (let i = 0; i < 3; i++) {
    if (board[i] === board[i + 3] && board[i] === board[i + 6]) {
      return board[i]
    }
  }

  // check diagonally
  if (board[0] === board[4] && board[0] === board[8]) {
    return board[0]
  }
  if (board[2] === board[4] && board[2] === board[6]) {
    return board[2]
  }

  // no winner
  return null;
}

const mutations = {
  playSquare: (state: State, index: number) => {
    if (!state.board[index]) {
      state.board[index] = state.currentPlayer
      state.currentPlayer = state.currentPlayer === Player.X ? Player.O : Player.X
      state.winner = checkWinner(state.board)
    }
  },
}

interface SquareProps {
  player: null | Player
  onClick?: () => void
}

function Square({ player, onClick }: SquareProps) {
  return (
    <div className={`square`} onClick={onClick}>
      {player && <img src={player === Player.X ? cross : nought}/>}
    </div>
  )
}

interface BoardProps {
  disabled: boolean
}

function Board({disabled}: BoardProps) {
  const makeMove = useMutation(gameState, mutations.playSquare)

  const board = useValue(gameState, s => s.board)

  return (
    <div className='board'>
      <div className='row'>
        <Square player={board[0]} onClick={disabled ? undefined : () => makeMove(0)}/>
        <Square player={board[1]} onClick={disabled ? undefined : () => makeMove(1)}/>
        <Square player={board[2]} onClick={disabled ? undefined : () => makeMove(2)}/>
      </div>
      <div className='row'>
        <Square player={board[3]} onClick={disabled ? undefined : () => makeMove(3)}/>
        <Square player={board[4]} onClick={disabled ? undefined : () => makeMove(4)}/>
        <Square player={board[5]} onClick={disabled ? undefined : () => makeMove(5)}/>
      </div>
      <div className='row'>
        <Square player={board[6]} onClick={disabled ? undefined : () => makeMove(6)}/>
        <Square player={board[7]} onClick={disabled ? undefined : () => makeMove(7)}/>
        <Square player={board[8]} onClick={disabled ? undefined : () => makeMove(8)}/>
      </div>
    </div>
  )
}

function Game() {
  const currentPlayer = useValue(gameState, s => s.currentPlayer)
  const winner = useValue(gameState, s => s.winner)

  const reset = useMutation(gameState, s => s = initialState)

  return (
    <div>
      {!winner && (
        <div>{currentPlayer}'s move</div>
      )}
      {winner && (
        <div>{winner} won!</div>
      )}
      <Board disabled={!!winner}/>
      <div className='button' onClick={reset}>Reset</div>
    </div>
  )
}


function App() {
  return (
    <Game/>
  )
}

export default App
