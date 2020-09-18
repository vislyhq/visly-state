import React from 'react'
import clsx from 'clsx'
import { configureAnchors } from 'react-scrollable-anchor'
import Layout from '@theme/Layout'
import styles from './styles.module.css'
import Feature from '../components/Feature'
import CursorSim from '../components/CursorSim'
import Footer from '../components/Footer'
import { setSyncAdapter, WSSyncAdapter } from '@visly/state'

configureAnchors({ offset: -80, scrollDuration: 200, keepLastAnchorHash: true })

// Check that we are running on client-side
if (typeof window !== 'undefined') {
    setSyncAdapter(
        WSSyncAdapter('wss://visly-state-website-backend.herokuapp.com'),
    )
}

const features = [
    {
        anchor: 'sync',
        title: 'Synchronize data',
        summary: `Share state between multiple clients. 
      As soon as a change is made on one client it is shared with all other 
      clients instantly and efficiently.`,
        icon: 'refresh',
        code: `
  import { syncedState, useValue } from '@visly/state' 

  const appState = syncedState({ cursors: [] }) 

  function Cursors() { 
    const cursors = useValue(appState, s => s.cursors) 
    return cursors.map(c => ( 
      <Cursor location={c.location} color={c.color} /> 
    )) 
  }
    `,
        leftAccessory: 'sync_left',
        rightAccessory: 'sync_right',
    },
    {
        anchor: 'share',
        title: 'Share logic',
        summary: `Visly State is built to be used on both the server and client. 
      This makes sharing business logic, data validation, and tests trivial.`,
        icon: 'share',
        code: `
  import { syncedState } from '@visly/state'
  
  export const appState = syncedState({ cursors: [] })

  export const mutations = {
    moveCursor: (state, id, location) => {
      const cursor = state.cursors.find(c => c.id === id)
      if (!cursor) return
      cursor.location = location
    }
  }
    `,
    },
    {
        anchor: 'time',
        title: 'Time travel',
        summary: `Being able to quickly undo & redo operations is a key feature
      in any modern app. Visly State manages this for you simply and efficiently.`,
        icon: 'watch',
        code: `
  import { undo, redo, useMutation } from '@visly/state'

  function Component() {
    const increment = useMutation(appState, s => s.count++)
    
    return [
      <button onClick={increment}>Increment</button>,
      <button onClick={() => undo(appState)}>Undo</button>,
      <button onClick={() => redo(appState)}>Redo</button>
    ]
  }
    `,
        leftAccessory: 'time_left',
        rightAccessory: 'time_right',
    },
    {
        anchor: 'perf',
        title: 'Improve performance',
        summary: `React performance is all about minimizing renders.
      Visly State keeps track of which components use what data and only
      re-renders the components it needs.`,
        icon: 'zap',
        code: `
  import { useValue } from '@visly/state'

  function Cursor(props) {
    // Only re-render when this specific cursor
    // has a new value, not when any cursor moves
    const cursor = useValue(appState, s => {
      return s.cursors.find(c => c.id === props.id)
    })

    return <Pointer position={cursor.location} />
  }
    `,
    },
]

function GitHubButton() {
    return (
        <a
            className="button github-button"
            href="https://github.com/vislyhq/visly-state"
        >
            View on GitHub
        </a>
    )
}

function Home() {
    const title = 'React state for real-time apps'
    return (
        <Layout title="Visly State">
            <header className={clsx('hero hero--primary', styles.heroBanner)}>
                <div className="hero-container">
                    <title>{title.toUpperCase()}</title>
                    <p>
                        A React state management library that extends to your
                        server.
                    </p>
                    <GitHubButton />
                    <CursorSim />
                </div>
                <img className="triangle" src={'/img/triangle.svg'} />
            </header>
            <section className="main-container">
                {features.map((feature, index) => (
                    <Feature key={index} {...feature} index={index} />
                ))}
                <GitHubButton />
                <img className="triangle" src={'/img/triangle.svg'} />
            </section>
            <Footer />
        </Layout>
    )
}

export default Home
