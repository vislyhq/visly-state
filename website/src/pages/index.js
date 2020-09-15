import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import styles from './styles.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as theme } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const features = [
  {
    title: 'Synchronize data',
    summary: `Share data between multiple clients using websockets. 
      As soon as a change is made on one client it is shared with all other 
      clients instantly and efficiently.`,
    code: `
      import { syncedState, useValue } from '@visly/state' 

      const appState = syncedState({ cursors: [] }) 

      function Cursors() { 
        const cursors = useValue(appState, s => s.cursors) 
        return cursors.map(c => ( 
          <Cursor location={c.location} color={c.color} /> 
        )) 
      }
    `
  },
  {
    title: 'Share logic',
    summary: `Visly State is built to be used on both the server and client. 
      This makes sharing business logic, data validation, and tests trivial.`,
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
    `
  },
  {
    title: 'Time travel',
    summary: `Being able to quickly undo & redo operations is a key feature
      in any modern app. Visly State manages this for you simply and efficiently.`,
    code: `
      import { undo, redo, useMutation } from '@visly/state'

      function Component() {
        const increment = useMutation(appState, s => s.counter++)

        return [
          <button onClick={increment}>Increment</button>
          <button onClick={() => undo(appState)}>Undo</button>
          <button onClick={() => redo(appState)}>Redo</button>
        ]
      }
    `
  },
  {
    title: 'Improve performance',
    summary: `React performance is all about minimizing renders.
      Visly State keeps track of which components use what data and only
      re-renders the components it needs.`,
    code: `
      import { useValue } from '@visly/state'

      function Cursor(props) {
        // Only re-render when this specific cursor has a new value,
        // not when any cursor moves const cursor = useValue(appState, s => {
          return s.cursors.find(c => c.id === props.id)
        })

        return <Pointer position={cursor.location} />
      }
    `
  },
];

function GithubButton() {
  return <a class="button github-button" href="https://github.com/vislyhq/visly-state">
    View on Github
    </a>
}

function Feature({title, summary, code}) {
  return (
    <div className='feature'>
      <div className='feature-summary'>
        <h1 className='feature-summary-h1'>{title}</h1>
        <p className='feature-summary-p'>{summary}</p>
      </div>
      <Code code={code}/>
    </div>

  )
}

function Code({code}) {
  const style = {
    borderRadius: 8,
    padding: 10,
    marginLeft: -20,
    marginRight: -20,
  }

  return (
    <div className='code-container'>
      <img className='gradient-box' src={'/img/gradient1.svg'}/>
      <div className='code' padding={['bottom']}>
            <SyntaxHighlighter
                  language='jsx'
                  style={theme}
                  customStyle={style}
            >
                {code}
            </SyntaxHighlighter>
      </div>
    </div>
    
  );
}

function Home() {
  const title = 'React state for real-time apps';
  return (
    <Layout
      title='Visly State'>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="hero-container">
          <title>{title.toUpperCase()}</title>
          <p>A React state management library that extends to your server.</p>
          <GithubButton/>
        </div>
        <img className='triangle' src={'/img/triangle.svg'}/>
      </header>
      <section className='main-container'>
        {features.map(feature =>
          <Feature title={feature.title}
            summary={feature.summary}
            code={feature.code}
          ></Feature>
        )}
        <GithubButton/>
        <img className='triangle' src={'/img/triangle.svg'}/>
      </section>
    </Layout>
  );
}

export default Home;
