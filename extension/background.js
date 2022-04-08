const port = browser.runtime.connectNative('socketcontrol');

const newtab = (url) => {
  browser.tabs.create({
    url: url,
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
  let url = message.url ? message.url.trim() : null;
  if (url && !url.match(/^[a-z]+:\/\/.+$/gi)) {
    url = `https://${url}`;
  }
  if (action == 'nt') {
    newtab(url);
  }
  if (action == 'nw') {
    newwindow(url);
  }
});

browser.browserAction.onClicked.addListener(() => {
  console.log(`SocketControl 1.5 on ${(new Date()).toISOString()}`);
});

window.addEventListener('unload', () => {
  port.postMessage('end');
}, false);
