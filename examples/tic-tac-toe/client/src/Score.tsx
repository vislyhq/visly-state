import React from 'react';

interface ScoreProps {
  title: string
  score: number
  addClass?: string
}

export function Score({ title, score, addClass }: ScoreProps) {
  return (
    <div className='score'>
      <div className={`score-title ${addClass ?? ''}`}>{title}</div>
      <div className='score-number'>{score}</div>
    </div>
  )
}