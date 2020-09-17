import React, { useState, useEffect, useRef } from 'react'

const icons = [
    'cursorBlue',
    'cursorGold',
    'cursorGreen',
    'cursorRed',
    'cursorTurquoise',
]

const getNewProps = () => ({
    x: Math.random(),
    y: Math.random(),
    duration: Math.floor(Math.random() * 1000) + 500,
})

const NUM_STATIC = 4
const NUM_MOVING = 4

const _staticIcons = icons.slice().reverse().slice(0, NUM_STATIC)
// don't let the static cursors obstruct the header content - restrict x to first and last quarters
const staticIcons = _staticIcons.map(getNewProps).map(({ x, y }, index) => ({
    x: x < 0.5 ? x / 2 : x / 2 + 0.5,
    y,
    icon: _staticIcons[index],
}))

let i = 0

function CursorSim() {
    const parentRef = useRef(null)
    const [dim, setDim] = useState({ w: 0, h: 0 })
    useEffect(() => {
        if (parentRef.current) {
            setDim({
                h: parentRef.current.offsetHeight - 26,
                w: parentRef.current.offsetWidth - 26,
            })
        }
    }, [parentRef])

    const [cursors, setCursors] = useState(Array(NUM_MOVING).map(getNewProps))
    const [display, setDisplay] = useState('none')
    useEffect(() => {
        setDisplay('block')
    })

    useEffect(() => {
        const timer = setInterval(() => {
            const currentIndex = i
            if (i === cursors.length - 1) {
                i = 0
            } else {
                i++
            }
            const cursor = getNewProps()
            setCursors(prev => [
                ...cursors.slice(0, currentIndex),
                cursor,
                ...cursors.slice(currentIndex + 1),
            ])
        }, 500)
        return () => clearInterval(timer)
    }, [cursors])

    return (
        <div className="cursor-sim" ref={parentRef}>
            {cursors.map((c, i) => (
                <Cursor
                    key={`moving-${i}`}
                    icon={icons[i % icons.length]}
                    display={display}
                    {...dim}
                    {...c}
                />
            ))}
            {staticIcons.map(({ icon, x, y }, i) => (
                <img
                    key={`static-${i}`}
                    className="cursor"
                    src={`/img/${icon}.svg`}
                    style={{
                        top: `${Math.floor(y * dim.h)}px`,
                        left: `${Math.floor(x * dim.w)}px`,
                        display,
                    }}
                />
            ))}
        </div>
    )
}

const Cursor = ({ icon, x, y, duration, w, h, display }) => {
    return (
        <img
            className="cursor"
            src={`/img/${icon}.svg`}
            style={{
                display,
                transition: `transform ${duration}ms ease-in-out`,
                transform: `translate(${Math.floor(x * w)}px, ${Math.floor(
                    y * h
                )}px)`,
            }}
        />
    )
}

export default CursorSim
