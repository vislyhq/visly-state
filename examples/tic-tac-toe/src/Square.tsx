import React from 'react'
import { Player } from './state'
import cross from './assets/cross.svg'
import nought from './assets/nought.svg'
import './App.css'

interface SquareProps {
    player: null | Player
    onClick?: () => void
}

export function Square({ player, onClick }: SquareProps) {
    return (
        <div className={`square`} onClick={onClick}>
            {player && (
                <img alt={player} src={player === Player.X ? cross : nought} />
            )}
        </div>
    )
}
