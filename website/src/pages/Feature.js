import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as theme } from 'react-syntax-highlighter/dist/cjs/styles/prism'

function BackgroundSelect({backgrounds, selected, onSelect}) {
  return (
    <div className='background-select'>
      {
        backgrounds.map((_, index) => {
          const className = index === selected ? 'select-circle selected' : 'select-circle';
          return <div className={className} onClick={() => onSelect(index)}></div>
        })

      }
    </div>
  )
}

function Code({code, background}) {
  const style = {
    borderRadius: 8,
    padding: 10,
    marginLeft: -20,
    marginRight: -20,
  }

  return (
    <div className='code-container'>
      <img className='gradient-box' src={`/img/${background}`}/>
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

function Feature({title, summary, code}) {

  const [selected, setSelected] = useState(0);
  const backgrounds = [
    'gradient1.svg', 'gradient2.svg', 'gradient3.svg', 'gradient4.svg'
  ]

  return (
    <div className='feature'>
      <div className='feature-summary'>
        <h1 className='feature-summary-h1'>{title}</h1>
        <p className='feature-summary-p'>{summary}</p>
      </div>
      <div className='background-select-container'>
        <BackgroundSelect
          backgrounds={backgrounds}
          selected={selected}
          onSelect={setSelected}/>
        <Code 
          code={code}
          background={backgrounds[selected]}/>
      </div>
    </div>
  )
}
  
export default Feature;