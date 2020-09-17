import React from 'react';

export function Score({title, score, addClass}: {title: string, score: number, addClass?: string}) {
  return <div className='score'>
      <div className={`score-title ${addClass ?? ''}`}>{title}</div>
      <div className='score-number'>{score}</div>
  </div>
}