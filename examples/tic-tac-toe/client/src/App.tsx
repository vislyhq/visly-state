import React from 'react'
import { useValue, useMutation } from '@visly/state'
import { gameState, mutations } from './state';
import { Board } from './Board';
import { Score } from './Score';
import arrow from './assets/arrowRight.svg';
import logo from './assets/logo.svg';
import logoBig from './assets/logoDark.svg';
import './App.css'

function App() {
  // should display this...
  const currentPlayer = useValue(gameState, s => s.currentPlayer)
  const winner = useValue(gameState, s => s.winner)
  const noughtScore = useValue(gameState, s => s.noughtScore)
  const crossScore = useValue(gameState, s => s.crossScore)
  const ties = useValue(gameState, s => s.ties)

  const reset = useMutation(gameState, mutations.reset)

  return (
    <div className='root'>
      <div className='header'>
        <img src={logo} alt='Visly' />
        <div className='button reset' onClick={reset}>Reset</div>
        <a href='#' target='_blank' rel='noopener noreferrer'>
          <div className='button new-tab'>
            Open a new tab <img src={arrow} alt='new tab' />
          </div>
        </a>
      </div>

      <Board disabled={!!winner}/>

      <div className='scores-row'>
        <Score title='PLAYER 1' score={crossScore} addClass='cross'/>
        <Score title='TIE GAMES' score={ties}/>
        <Score title='PLAYER 2' score={noughtScore} addClass='nought'/>
      </div>
      <div className='made-by'>
        <span className='made-by-p'>Made by</span>
        <a href='https://visly.app/' target='_blank' rel='noopener noreferrer'>
          <img src={logoBig} alt='Visly' style={{ height: '30px', marginBottom: '-1px'}} />
        </a>
      </div>
    </div>
  )
}

export default App
