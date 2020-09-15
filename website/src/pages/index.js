import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import styles from './styles.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as theme } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const features = [
  {
    title: 'Synchronise data',
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
    title: 'Time travel',
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
    title: 'Improve performance',
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
];

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
  const title = 'React state for real time apps';
  return (
    <Layout
      title='Visly State'>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="hero-container">
          <title>{title.toUpperCase()}</title>
          <p>A React state management library that extends to your server.</p>
          <a class="github-link" href="https://github.com/vislyhq/visly-state">
            View on Github
          </a>
        </div>
      </header>
      <div className='triangle-right'></div>
      <section className='main-container'>
        {features.map(feature =>
          <Feature title={feature.title}
            summary={feature.summary}
            code={feature.code}
          ></Feature>
        )}
      </section>
    </Layout>
  );
}

export default Home;
