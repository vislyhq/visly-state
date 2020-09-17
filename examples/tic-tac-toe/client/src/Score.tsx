import React from 'react';

export function Score({ title, score }: { title: string, score: number }) {
  return (
    <div className='score'>
      <div className='score-title'>{title}</div>
      <div className='score-number'>{score}</div>
    </div>
  );
}