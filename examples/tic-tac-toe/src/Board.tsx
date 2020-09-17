import React from 'react'
import { useMutation, useValue } from '@visly/state'
import { gameState, mutations } from './state'
import { Square } from './Square'
import './App.css'

interface BoardProps {
    disabled: boolean
}

export function Board({ disabled }: BoardProps) {
    const makeMove = useMutation(gameState, mutations.playSquare)

    const board = useValue(gameState, s => s.board)

    return (
        <div className="board">
            <div className="row">
                <Square
                    player={board[0]}
                    onClick={disabled ? undefined : () => makeMove(0)}
                />
                <Square
                    player={board[1]}
                    onClick={disabled ? undefined : () => makeMove(1)}
                />
                <Square
                    player={board[2]}
                    onClick={disabled ? undefined : () => makeMove(2)}
                />
            </div>
            <div className="row">
                <Square
                    player={board[3]}
                    onClick={disabled ? undefined : () => makeMove(3)}
                />
                <Square
                    player={board[4]}
                    onClick={disabled ? undefined : () => makeMove(4)}
                />
                <Square
                    player={board[5]}
                    onClick={disabled ? undefined : () => makeMove(5)}
                />
            </div>
            <div className="row">
                <Square
                    player={board[6]}
                    onClick={disabled ? undefined : () => makeMove(6)}
                />
                <Square
                    player={board[7]}
                    onClick={disabled ? undefined : () => makeMove(7)}
                />
                <Square
                    player={board[8]}
                    onClick={disabled ? undefined : () => makeMove(8)}
                />
            </div>
        </div>
    )
}
