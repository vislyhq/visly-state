import React, { useState, useEffect, useRef } from 'react';

const icons = [
  'cursorBlue',
  'cursorGold',
  'cursorGreen',
  'cursorRed',
  'cursorTurquoise',
];

const getNewProps = () => ({
  x: Math.random(),
  y: Math.random(),
  duration: Math.floor(Math.random() * 1000) + 500,
});

const initialPos = getNewProps();

let i = 0;

function CursorSim() {
  const parentRef   = useRef(null);
  const [dim, setDim] = useState({ w: 0, h: 0 });

  useEffect ( () => {
    if (parentRef.current) {
      setDim({ h: parentRef.current.offsetHeight - 26, w: parentRef.current.offsetWidth - 26 });
    }
  }, [parentRef]);

  const [cursors, setCursors] = useState(icons.map(getNewProps))

  useEffect(() => {
    const timer = setInterval(() => {
      const currentIndex = i;
      if (i === cursors.length - 1) {
        i = 0;
      } else {
        i++;
      }
      const cursor = getNewProps();
      setCursors((prev) => [
        ...cursors.slice(0, currentIndex),
        cursor,
        ...cursors.slice(currentIndex + 1),
      ]);
    }, 500);
    return () => clearInterval(timer);
  }, [cursors]);

  return (
    <div
      className='cursor-sim'
      ref={parentRef}
    >
      {cursors.map((c, i) => (
        <Cursor
          key={i}
          icon={icons[i]}
          {...dim}
          {...c}
        />
      ))}
    </div>
  )
}

const Cursor = ({icon, x, y, duration, w, h}) => (
  <img
    className='cursor'
    src={`/img/${icon}.svg`}
    style={{
      transition: `transform ${duration}ms ease-in-out`,
      transform: `translate(${Math.floor(x * w)}px, ${Math.floor(y * h)}px)`,
    }}
  />
);

export default CursorSim;
