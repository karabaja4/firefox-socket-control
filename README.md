# NativeControl

Control your Firefox from a Native App.

Attached is a Node.js Native App that opens a UNIX socket which forwards messages to Firefox to open a New Window or a New Tab with the specified URL.

This can replace dbus to allow Firefox to open New Tabs or New Windows using the running instance if dbus is not available on your system.

## Dependencies

You need `openbsd-netcat` and `nodejs`.

## Installation

### Arch Linux

There is an [AUR package](https://aur.archlinux.org/packages/firefox-socket-control-git) available.

### Other distributions

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

### Using attached `firefox-socket-control` script

The script opens a new Firefox window if no parameters are provided, or opens a new tab for each URL parameter:

```bash
# new window
firefox-socket-control

# new tabs
firefox-socket-control https://bbs.archlinux.org https://www.youtube.com
```

If Firefox instance is not running, a new instance is started. Otherwise, an existing instance is used.

### Sending messages to the socket using `nc`:

   ```bash
   # new tab (empty)
   printf '%s' 'nt' | nc -U -q0 /tmp/firefox.sock

   # new window (empty)
   printf '%s' 'nw' | nc -U -q0 /tmp/firefox.sock

   # new tab (url)
   printf '%s' 'nt|https://bbs.archlinux.org|https://youtube.com' | nc -U -q0 /tmp/firefox.sock

   # new window (url)
   printf '%s' 'nw|https://bbs.archlinux.org|https://youtube.com' | nc -U -q0 /tmp/firefox.sock
   ```
   `https://` prefix is optional:

   ```bash
   # new tab
   printf '%s' 'nt|bbs.archlinux.org|youtube.com' | nc -U -q0 /tmp/firefox.sock
   ```