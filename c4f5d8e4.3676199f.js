(window.webpackJsonp=window.webpackJsonp||[]).push([[11,5],{71:function(e,t,n){"use strict";n.r(t);var a=n(2),r=n(0),c=n.n(r),s=n(75),o=n(86),i=n(65),l=n.n(i),u=n(408),m=n(373);function d(e){var t=e.backgrounds,n=e.selected,a=e.onSelect;return c.a.createElement("div",{className:"background-select"},t.map((function(e,t){var r=t===n?"select-circle selected":"select-circle";return c.a.createElement("div",{key:t,className:r,onClick:function(){return a(t)}})})))}function f(e){var t=e.code,n=e.background;return c.a.createElement("div",{className:"code-container"},c.a.createElement("img",{className:"gradient-box",src:"/img/"+n}),c.a.createElement("div",{className:"code"},c.a.createElement(u.a,{language:"jsx",style:m.atomDark,customStyle:{borderRadius:8,padding:10,marginLeft:-20,marginRight:-20,boxShadow:"0 20px 40px -5px rgba(0, 0, 0, 0.6)"}},t)))}var g=function(e){var t=e.title,n=e.summary,a=e.code,s=e.icon,o=e.leftAccessory,i=e.rightAccessory,l=Object(r.useState)(0),u=l[0],m=l[1],g=["gradient1.png","gradient2.png","gradient3.png","gradient4.png"];return c.a.createElement("div",{className:"feature"},c.a.createElement("div",{className:"feature-summary"},c.a.createElement("img",{className:"feature-icon",src:"/img/"+s+".svg"}),c.a.createElement("h1",null,t),c.a.createElement("p",null,n)),c.a.createElement("div",{className:"background-select-container"},c.a.createElement(d,{backgrounds:g,selected:u,onSelect:m}),c.a.createElement(f,{code:a,background:g[u]}),o&&c.a.createElement("div",{className:"feature-left-accessory"},c.a.createElement("img",{src:"/img/"+o+".svg"})),i&&c.a.createElement("div",{className:"feature-right-accessory"},c.a.createElement("img",{src:"/img/"+i+".svg"}))))},p=["cursorBlue","cursorGold","cursorGreen","cursorRed","cursorTurquoise"],h=function(){return{x:Math.random(),y:Math.random(),duration:Math.floor(1e3*Math.random())+500}},y=(h(),0);var b=function(e){var t=e.icon,n=e.x,a=e.y,r=e.duration,s=e.w,o=e.h;return c.a.createElement("img",{className:"cursor",src:"/img/"+t+".svg",style:{transition:"transform "+r+"ms ease-in-out",transform:"translate("+Math.floor(n*s)+"px, "+Math.floor(a*o)+"px)"}})},v=function(){var e=Object(r.useRef)(null),t=Object(r.useState)({w:0,h:0}),n=t[0],s=t[1];Object(r.useEffect)((function(){e.current&&s({h:e.current.offsetHeight-26,w:e.current.offsetWidth-26})}),[e]);var o=Object(r.useState)(p.map(h)),i=o[0],l=o[1];return Object(r.useEffect)((function(){var e=setInterval((function(){var e=y;y===i.length-1?y=0:y++;var t=h();l((function(n){return[].concat(i.slice(0,e),[t],i.slice(e+1))}))}),500);return function(){return clearInterval(e)}}),[i]),c.a.createElement("div",{className:"cursor-sim",ref:e},i.map((function(e,t){return c.a.createElement(b,Object(a.a)({key:t,icon:p[t]},n,e))})))};function E(){return c.a.createElement("a",{class:"button blog-button",href:"https://visly.app/blog"},"Read our blog")}var S=function(){return c.a.createElement("footer",{className:"footer"},c.a.createElement("div",{className:"footer-content"},c.a.createElement("h1",null,"Built by Visly"),c.a.createElement("p",null,"Visly is amazing and we build cool shit. Read more about it in our blog. Visly is amazing and we build cool shit. Read more about it in our blog.")),c.a.createElement(E,null))},k=[{title:"Synchronize data",summary:"Share data between multiple clients using websockets. \n      As soon as a change is made on one client it is shared with all other \n      clients instantly and efficiently.",icon:"refresh",code:"\n  import { syncedState, useValue } from '@visly/state' \n\n  const appState = syncedState({ cursors: [] }) \n\n  function Cursors() { \n    const cursors = useValue(appState, s => s.cursors) \n    return cursors.map(c => ( \n      <Cursor location={c.location} color={c.color} /> \n    )) \n  }\n    ",leftAccessory:"sync_left",rightAccessory:"sync_right"},{title:"Share logic",summary:"Visly State is built to be used on both the server and client. \n      This makes sharing business logic, data validation, and tests trivial.",icon:"share",code:"\n  import { syncedState } from '@visly/state'\n  \n  export const appState = syncedState({ cursors: [] })\n  export const mutations = {\n    moveCursor: (state, id, location) => {\n      const cursor = state.cursors.find(c => c.id === id)\n      if (!cursor) return\n      cursor.location = location\n    }\n  }\n    "},{title:"Time travel",summary:"Being able to quickly undo & redo operations is a key feature\n      in any modern app. Visly State manages this for you simply and efficiently.",icon:"watch",code:"\n  import { undo, redo, useMutation } from '@visly/state'\n\n  function Component() {\n    const increment = useMutation(appState, s => s.count++)\n    return [\n      <button onClick={increment}>Increment</button>,\n      <button onClick={() => undo(appState)}>Undo</button>,\n      <button onClick={() => redo(appState)}>Redo</button>\n    ]\n  }\n    ",leftAccessory:"time_left",rightAccessory:"time_right"},{title:"Improve performance",summary:"React performance is all about minimizing renders.\n      Visly State keeps track of which components use what data and only\n      re-renders the components it needs.",icon:"zap",code:"\n  import { useValue } from '@visly/state'\n\n  function Cursor(props) {\n    // Only re-render when this specific cursor\n    // has a new value, not when any cursor moves\n    const cursor = useValue(appState, s => {\n      return s.cursors.find(c => c.id === props.id)\n    })\n\n    return <Pointer position={cursor.location} />\n  }\n    "}];function w(){return c.a.createElement("a",{className:"button github-button",href:"https://github.com/vislyhq/visly-state"},"View on GitHub")}t.default=function(){return c.a.createElement(o.a,{title:"Visly State"},c.a.createElement("header",{className:Object(s.a)("hero hero--primary",l.a.heroBanner)},c.a.createElement("div",{className:"hero-container"},c.a.createElement("title",null,"React state for real-time apps".toUpperCase()),c.a.createElement("p",null,"A React state management library that extends to your server."),c.a.createElement(w,null),c.a.createElement(v,null)),c.a.createElement("img",{className:"triangle",src:"/img/triangle.svg"})),c.a.createElement("section",{className:"main-container"},k.map((function(e,t){return c.a.createElement(g,Object(a.a)({key:t},e))})),c.a.createElement(w,null),c.a.createElement("img",{className:"triangle",src:"/img/triangle.svg"})),c.a.createElement(S,null))}},89:function(e,t,n){"use strict";t.a=function(){return null}}}]);