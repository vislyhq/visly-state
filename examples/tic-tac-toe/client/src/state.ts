import { state } from '@visly/state';

export enum Player {
  X = 'X',
  O = 'O',
}

export type Board = Array<null | Player>

export interface State {
  board: Board
  currentPlayer: Player
  winner: null | false | Player
  noughtScore: number,
  crossScore: number,
  ties: number
}

const emptyBoard: Board = new Array(9).fill(null)

const initialState: State = {
  board: emptyBoard,
  currentPlayer: Player.O,
  winner: null,
  noughtScore: 0,
  crossScore: 0,
  ties: 0
}

export const gameState = state<State>(initialState)

const checkWinner = (board: Board): null | false | Player => {
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

  // tie
  if (board.every(square => !!square)) {
    return false
  }

  // no winner
  return null
}

export const mutations = {
  playSquare: (state: State, index: number) => {
    if (!state.board[index]) {
      state.board[index] = state.currentPlayer
      state.currentPlayer = state.currentPlayer === Player.X ? Player.O : Player.X
      state.winner = checkWinner(state.board)

      if (state.winner === Player.O) {
        state.noughtScore++
      } else if (state.winner === Player.X) {
        state.crossScore++
      } else if (state.winner === false) {
        state.ties++
      }
    }
  },
  reset: (state: State) => {
    state.board = initialState.board
    state.currentPlayer = initialState.currentPlayer
    state.winner = initialState.winner
  }
}