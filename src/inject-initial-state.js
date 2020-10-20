export default function injectInitialState(state) {
  const script = document.createElement(`script`);
  script.innerHTML = `window.__INITIAL_STATE__ = ${JSON.stringify(state)}`;
  document.head.appendChild(script);
}
