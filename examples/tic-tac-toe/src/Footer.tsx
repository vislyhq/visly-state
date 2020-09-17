import React from "react";
import logoBig from './assets/logoDark.svg'

export function Footer() {
    return (
    <div className="made-by">
        <span className="made-by-p">Made by</span>
        <a
            href="https://visly.app/"
            target="_blank"
            rel="noopener noreferrer"
        >
            <img
                src={logoBig}
                alt="Visly"
                style={{ height: '30px', marginBottom: '-1px' }}
            />
        </a>
    </div>
    )
}