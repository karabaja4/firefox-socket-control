# NativeControl

Control your Firefox from a Native App.

Attached is a Node.js Native App example that opens a socket to receive messages that are sent Firefox to open New Window or a New Tab with the specified URL.

## Installation

1. Setup a native app:
   ```bash
   # modify native_control.json to set a correct native_control.js path
   ln -s ${PWD}/app/native_control.json ${HOME}/.mozilla/native-messaging-hosts/native_control.json
   ```

2. Start Firefox and install the extension.

3. Send a message to the socket:
   ```bash
   # new tab (empty)
   printf '%s' 'nt' | nc -U -q0 /tmp/firefox.sock

   # new window (empty)
   printf '%s' 'nw' | nc -U -q0 /tmp/firefox.sock

   # new tab (url)
   printf '%s' 'nt|www.google.com' | nc -U -q0 /tmp/firefox.sock

   # new window (url)
   printf '%s' 'nt|www.google.com' | nc -U -q0 /tmp/firefox.sock
   ```