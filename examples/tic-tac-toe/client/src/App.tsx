import React from 'react'
import { useValue, useMutation } from '@visly/state'
import { gameState, mutations } from './state';
import { Board } from './Board';
import { Score } from './Score';
import logo from './assets/logoDark.svg';
import './App.css'

function App() {
  const currentPlayer = useValue(gameState, s => s.currentPlayer)
  const winner = useValue(gameState, s => s.winner)
  const noughtScore = useValue(gameState, s => s.noughtScore)
  const crossScore = useValue(gameState, s => s.crossScore)
  const ties = useValue(gameState, s => s.ties)

  const reset = useMutation(gameState, mutations.reset)

  return (
    <div>
      {winner === null && (
        <div>{currentPlayer}'s move</div>
      )}
      {winner && (
        <div>{winner} won!</div>
      )}
      {winner === false && (
        <div>It's a tie!</div>
      )}
      <Board disabled={!!winner}/>
      <div className='button' onClick={reset}>Reset</div>

      <div className='scores-row'>
        <Score title='PLAYER 1' score={crossScore} addClass='cross'/>
        <Score title='TIE GAMES' score={ties}/>
        <Score title='PLAYER 2' score={noughtScore} addClass='nought'/>
      </div>
      <div className='made-by'>
        <span className='made-by-p'>Made by</span>
        <a href='https://visly.app/' target='_blank' rel='noopener noreferrer'>
          <img src={logo} style={{ height: '30px', marginBottom: '-1px'}} />
        </a>
      </div>
    </div>
  )
}

export default App
