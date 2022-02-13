# NativeControl

Control your Firefox from a Native App.

Attached is a Node.js Native App that opens a UNIX socket to receive messages that are forwarded Firefox to open New Window or a New Tab with the specified URL.

This can replace dbus to allow Firefox to open New Tabs or New Windows using the running instance if dbus is not available on your system.

## Dependencies

You need `openbsd-netcat` and `nodejs`.

## Installation

If you use Arch Linux, there is an [AUR package](https://aur.archlinux.org/packages/firefox-socket-control-git) available.

Otherwise, follow the steps below.

1. Setup an extension and a native app:
   ```bash
   cd nativecontrol/
   install -Dm755 "firefox-socket-control" "/usr/bin/firefox-socket-control"
   install -Dm755 "app/native_control.js" "/usr/lib/mozilla/native-messaging-hosts/native_control.js"
   install -Dm644 "app/native_control.json" "/usr/lib/mozilla/native-messaging-hosts/native_control.json"

   wget https://addons.mozilla.org/firefox/downloads/file/3908096/nativecontrol-1.2-fx.xpi
   install -Dm644 "nativecontrol-1.2-fx.xpi" "/usr/lib/firefox/browser/extensions/native_control@karabaja4.xpi"
   ```

2. Open and close Firefox once. On second opening, the extension will become active.

## Usage

### Using `firefox-socket-control` script

The script opens a new Firefox window if no parameters are provided, or opens a new tab for each URL parameter:

```bash
# new window
firefox-socket-control

# new tabs
firefox-socket-control https://bbs.archlinux.org https://www.youtube.com
```

If Firefox instance is not running, a new instance is started. Otherwise, an existing instance is used.

### Sending messages manually to the socket:

   ```bash
   # new tab (empty)
   printf '%s' 'nt' | nc -U -q0 /tmp/firefox.sock

   # new window (empty)
   printf '%s' 'nw' | nc -U -q0 /tmp/firefox.sock

   # new tab (url)
   printf '%s' 'nt|www.google.com' | nc -U -q0 /tmp/firefox.sock

   # new window (url)
   printf '%s' 'nw|www.google.com' | nc -U -q0 /tmp/firefox.sock
   ```