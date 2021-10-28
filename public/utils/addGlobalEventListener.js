export default function addGlobalEventListener(eventType, DomSelector, callback) {
  document.addEventListener(eventType, (e) => {
    if (e.target.matches(DomSelector)) {
      callback(e);
    }
  });
}
