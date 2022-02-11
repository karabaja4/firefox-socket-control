const port = browser.runtime.connectNative('native_control');

const newtab = (url) => {
  browser.tabs.create({
    url: (url && !url.match(/^[a-z]+:\/\/.+$/gi)) ? `https://${url}` : url,
    active: true,
    discarded: false,
  });
}

const newwindow = (url) => {
  browser.windows.create({
    url: url
  });
}

port.onMessage.addListener((message) => {
  const action = message.action ? message.action.trim() : null;
  const url = message.url ? message.url.trim() : null;
  if (action == 'nt') {
    newtab(url);
  }
  if (action == 'nw') {
    newwindow(url);
  }
});

browser.browserAction.onClicked.addListener(() => {
  console.log(`NativeControl 1.0 on ${(new Date()).toISOString()}`);
});

window.addEventListener('unload', () => {
  port.postMessage('end');
}, false);
