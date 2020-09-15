(window.webpackJsonp=window.webpackJsonp||[]).push([[21,6,11,14,22],{76:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),s=n(87),o=n(92),i=n(77),c=n.n(i),l=n(426),u=n(391),m=[{title:"Synchronize data",summary:"Share data between multiple clients using websockets. \n      As soon as a change is made on one client it is shared with all other \n      clients instantly and efficiently.",code:"\n      import { syncedState, useValue } from '@visly/state' \n\n      const appState = syncedState({ cursors: [] }) \n\n      function Cursors() { \n        const cursors = useValue(appState, s => s.cursors) \n        return cursors.map(c => ( \n          <Cursor location={c.location} color={c.color} /> \n        )) \n      }\n    "},{title:"Share logic",summary:"Visly State is built to be used on both the server and client. \n      This makes sharing business logic, data validation, and tests trivial.",code:"\n      import { syncedState } from '@visly/state'\n      \n      export const appState = syncedState({ cursors: [] })\n      export const mutations = {\n        moveCursor: (state, id, location) => {\n          const cursor = state.cursors.find(c => c.id === id)\n          if (!cursor) return\n          cursor.location = location\n        }\n      }\n    "},{title:"Time travel",summary:"Being able to quickly undo & redo operations is a key feature\n      in any modern app. Visly State manages this for you simply and efficiently.",code:"\n      import { undo, redo, useMutation } from '@visly/state'\n\n      function Component() {\n        const increment = useMutation(appState, s => s.counter++)\n\n        return [\n          <button onClick={increment}>Increment</button>\n          <button onClick={() => undo(appState)}>Undo</button>\n          <button onClick={() => redo(appState)}>Redo</button>\n        ]\n      }\n    "},{title:"Improve performance",summary:"React performance is all about minimizing renders.\n      Visly State keeps track of which components use what data and only\n      re-renders the components it needs.",code:"\n      import { useValue } from '@visly/state'\n\n      function Cursor(props) {\n        // Only re-render when this specific cursor has a new value,\n        // not when any cursor moves const cursor = useValue(appState, s => {\n          return s.cursors.find(c => c.id === props.id)\n        })\n\n        return <Pointer position={cursor.location} />\n      }\n    "}];function d(){return r.a.createElement("a",{class:"github-link",href:"https://github.com/vislyhq/visly-state"},"View on Github")}function p(e){var t=e.title,n=e.summary,a=e.code;return r.a.createElement("div",{className:"feature"},r.a.createElement("div",{className:"feature-summary"},r.a.createElement("h1",{className:"feature-summary-h1"},t),r.a.createElement("p",{className:"feature-summary-p"},n)),r.a.createElement(y,{code:a}))}function y(e){var t=e.code;return r.a.createElement("div",{className:"code-container"},r.a.createElement("div",{className:"code",padding:["bottom"]},r.a.createElement(l.a,{language:"jsx",style:u.tomorrow,customStyle:{borderRadius:8,padding:10,marginLeft:-20,marginRight:-20}},t)))}t.default=function(){return r.a.createElement(o.a,{title:"Visly State"},r.a.createElement("header",{className:Object(s.a)("hero hero--primary",c.a.heroBanner)},r.a.createElement("div",{className:"hero-container"},r.a.createElement("title",null,"React state for real time apps".toUpperCase()),r.a.createElement("p",null,"A React state management library that extends to your server."),r.a.createElement(d,null)),r.a.createElement("img",{className:"triangle",src:"../../static/img/triangle.svg"})),r.a.createElement("section",{className:"main-container"},m.map((function(e){return r.a.createElement(p,{title:e.title,summary:e.summary,code:e.code})})),r.a.createElement(d,null),r.a.createElement("img",{className:"triangle",src:"../../static/img/triangle.svg"})))}},93:function(e,t,n){"use strict";var a=n(0),r=n.n(a);n(47);function s(){return r.a.createElement("a",{class:"blog-link",href:"https://visly.app/blog"},"Read our blog")}t.a=function(){return r.a.createElement("footer",{className:"footer"},r.a.createElement("div",{className:"footer-content"},r.a.createElement("h1",null,"Built by Visly"),r.a.createElement("p",null,"Visly is amazing and we build cool shit. Read more about it in our blog. Visly is amazing and we build cool shit. Read more about it in our blog.")),r.a.createElement(s,null))}}}]);