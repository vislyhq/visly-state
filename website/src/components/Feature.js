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

    boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.6)'
  }

  return (
    <div className='code-container'>
      <img className='gradient-box' src={`/img/${background}`}/>
      <div className='code'>
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

function Feature({title, summary, code, icon, leftAccessory, rightAccessory}) {
  const [selected, setSelected] = useState(0);
  const backgrounds = [
    'gradient1.png', 'gradient2.png', 'gradient3.png', 'gradient4.png'
  ]

  return (
    <div className='feature'>
      <div className='feature-summary'>
        <img className='feature-icon' src={`/img/${icon}.svg`} />
        <h1>{title}</h1>
        <p>{summary}</p>
      </div>
      <div className='background-select-container'>
        <BackgroundSelect
          backgrounds={backgrounds}
          selected={selected}
          onSelect={setSelected}/>
        <Code 
          code={code}
          background={backgrounds[selected]}/>
        {leftAccessory && (
          <div className='feature-left-accessory'>
            <img src={`/img/${leftAccessory}.svg`} />
          </div>
        )}
        {rightAccessory && (
          <div className='feature-right-accessory'>
            <img src={`/img/${rightAccessory}.svg`} />
          </div>
        )}
      </div>
    </div>
  )
}
  
export default Feature;