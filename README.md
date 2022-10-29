# Firefox Socket Control

Control Firefox from a UNIX socket.

Attached is a Go Native Messaging App that creates a UNIX socket which receives and forwards messages to a Firefox extension [SocketControl](https://addons.mozilla.org/en-US/firefox/addon/socketcontrol/) which then opens a New Tab or a New Window based on contents of the message. Check the **Usage** section for examples.

This can replace `dbus` to allow Firefox to open a New Tab or New Window in a running instance if `dbus` is not available on your system.

## Dependencies

You need `go` (build), `openbsd-netcat`.

## Installation

### Arch Linux

There is an [AUR package](https://aur.archlinux.org/packages/firefox-socket-control-git) available. No additional configuration is necessary.

### Other distributions

1. Clone the repository, change directory and download the extension inside the directory:
   ```bash
   git clone https://github.com/karabaja4/firefox-socket-control.git
   cd firefox-socket-control/
   wget https://addons.mozilla.org/firefox/downloads/file/3933677/socketcontrol-1.5-fx.xpi
   ```

2. Build the native (Go) application:
   ```bash
   go build -trimpath -o "app/socketcontrol" "app/socketcontrol.go"
   ```

2. Install the native application (as root):
   ```bash
   install -Dm755 "firefox-socket" "/usr/bin/firefox-socket"
   install -Dm755 "app/socketcontrol" "/usr/lib/mozilla/native-messaging-hosts/socketcontrol"
   install -Dm644 "app/socketcontrol.json" "/usr/lib/mozilla/native-messaging-hosts/socketcontrol.json"
   ```

3. Install the extension:

   If Firefox was built with `--allow-addon-sideload`, you can install the extension directly in the filesystem (as root):
   ```bash
   install -Dm644 "socketcontrol-1.5-fx.xpi" "/usr/lib/firefox/browser/extensions/native_control@karabaja4.xpi"
   ```
   Restart Firefox once to enable the extension.
   
   If the Firefox was not built with addon sideloading (or the extension will not load with the above method), you will need to download and install the extension from the Firefox Addons page:
   https://addons.mozilla.org/en-US/firefox/addon/socketcontrol/

4. You are ready to go! Run the `firefox-socket` command.

## Usage

### Using the attached `firefox-socket` script

The script opens a new window for each of the parameters:

```bash
# new window (empty)
/usr/bin/firefox-socket

# new windows (urls)
/usr/bin/firefox-socket https://archlinux.org https://www.youtube.com
```

If Firefox instance is not running, a new Firefox instance is started. Otherwise, a new window is opened by messaging the running instance.

### Sending messages to the socket using `nc`:

The socket is created in the following location:
   ```bash
   /tmp/firefox.sock
   ```
   You can use this socket to open new windows or new tabs by on the running Firefox instance. Examples:
   ```bash
   # new tab (empty)
   printf '%s' 'nt' | nc -NU /tmp/firefox.sock

   # new window (empty)
   printf '%s' 'nw' | nc -NU /tmp/firefox.sock

   # new tab (url)
   printf '%s' 'nt|https://archlinux.org' | nc -NU /tmp/firefox.sock

   # new window (url)
   printf '%s' 'nw|https://archlinux.org|https://youtube.com' | nc -NU /tmp/firefox.sock
   ```
   `https://` prefix is optional, this will also work:

   ```bash
   # new tab (no prefix)
   printf '%s' 'nt|archlinux.org|youtube.com' | nc -NU /tmp/firefox.sock
   ```
