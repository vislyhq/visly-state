import React from 'react';

function BlogButton() {
  return <a className="button blog-button" href="https://visly.app/blog">
    Read our blog
    </a>
}

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <h1>Built by Visly</h1>
        <p>Visly is a design tool that allows you to design & build React components visually. We care deeply about quality - read more about what we do.</p>
      </div>
      <BlogButton/>
      <div className='made-by'>
        <span>Made by</span>
        <a href='https://visly.app/' target='_blank' rel='noopener noreferrer'><img src={`/img/logoDark.svg`} style={{ height: '30px', marginBottom: '-4px'}} /></a>
      </div>
    </footer>
  );
}

export default Footer;
