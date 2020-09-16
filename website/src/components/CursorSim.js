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
  duration: Math.floor(Math.random() * 3000) + 500,
});

let i = 0;

function CursorSim() {
  const parentRef   = useRef(null);
  const [dim, setDim] = useState({ w: 0, h: 0 });

  useEffect ( () => {
    if (parentRef.current) {
      setDim({ h: parentRef.current.offsetHeight, w: parentRef.current.offsetWidth });
      // console.log('w, h', parentRef.current.offsetHeight, parentRef.current.offsetWidth);
    }
  }, [parentRef]);

  const [cursors, setCursors] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(getNewProps))

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
          icon={icons[i % icons.length]}
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
      transition: `transform ${duration}ms ease`,
      transform: `translate(${Math.floor(x * w)}px, ${y * h}px)`,
    }}
  />
);

export default CursorSim;
