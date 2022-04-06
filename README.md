# Firefox Socket Control

Control your Firefox from a UNIX socket provided by the Native Messaging App.

Attached is a Node.js Native Messaging App that creates a UNIX socket which receives and forwards messages to a Firefox extension [NativeControl](https://addons.mozilla.org/en-US/firefox/addon/nativecontrol/) which then opens a New Tab or a New Window based on contents of the message. Check the **Usage** section for examples.

This can replace `dbus` to allow Firefox to open a New Tab or New Window in a running instance if `dbus` is not available on your system.

## Dependencies

You need `openbsd-netcat` and `nodejs`.

## Installation

### Arch Linux

There is an [AUR package](https://aur.archlinux.org/packages/firefox-socket-control-git) available.

### Other distributions

1. Setup an extension and a native app:
   ```bash
   # fetch the files
   git clone https://github.com/karabaja4/nativecontrol.git
   cd nativecontrol/
   wget https://addons.mozilla.org/firefox/downloads/file/3908096/nativecontrol-1.2-fx.xpi

   # run as root
   install -Dm755 "firefox-socket-control" "/usr/bin/firefox-socket-control"
   install -Dm755 "app/native_control.js" "/usr/lib/mozilla/native-messaging-hosts/native_control.js"
   install -Dm644 "app/native_control.json" "/usr/lib/mozilla/native-messaging-hosts/native_control.json"
   install -Dm644 "nativecontrol-1.2-fx.xpi" "/usr/lib/firefox/browser/extensions/native_control@karabaja4.xpi"
   ```

2. Open and close Firefox once. On second opening, the extension will become active.

## Usage

### Using the attached `firefox-socket-control` script

The script opens a New Window if no parameters are provided, or opens a New Tab for each URL parameter:

```bash
# new window
firefox-socket-control

# new tabs
firefox-socket-control https://archlinux.org https://www.youtube.com
```

If Firefox instance is not running, a new instance is started. Otherwise, a message is sent to the running instance.

### Sending messages to the socket using `nc`:

The socket is created in the following location:
   ```bash
   /tmp/firefox.sock
   ```

   Examples:
   ```bash
   # new tab (empty)
   printf '%s' 'nt' | nc -U -q0 /tmp/firefox.sock

   # new window (empty)
   printf '%s' 'nw' | nc -U -q0 /tmp/firefox.sock

   # new tab (url)
   printf '%s' 'nt|https://archlinux.org' | nc -U -q0 /tmp/firefox.sock

   # new window (url)
   printf '%s' 'nw|https://archlinux.org|https://youtube.com' | nc -U -q0 /tmp/firefox.sock
   ```
   `https://` prefix is optional, this will also work:

   ```bash
   # new tab (no prefix)
   printf '%s' 'nt|archlinux.org|youtube.com' | nc -U -q0 /tmp/firefox.sock
   ```
