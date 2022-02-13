# Maintainer: Igor Saric <karabaja4 at gmail.com>
# shellcheck disable=SC2181,SC2148,SC2034,SC2164,SC2154

_gitname=nativecontrol
_version=1.2
pkgname=firefox-socket-control-git
pkgver=${_version}.a35c941
pkgrel=1
pkgdesc="Control your Firefox using UNIX sockets."
arch=('any')
url="https://github.com/karabaja4/${_gitname}"
license=('MIT')
depends=('openbsd-netcat' 'nodejs')
makedepends=('git')
source=("git://github.com/karabaja4/${_gitname}.git"
        "https://addons.mozilla.org/firefox/downloads/file/3908096/nativecontrol-1.2-fx.xpi")
sha256sums=('SKIP'
            'a91df1511816958328360daa1246058da31b6bae3b7bdde9e132c3f228d32f58')

pkgver() {
  cd "${_gitname}"
  echo "${_version}.$(git rev-parse --short HEAD)"
}

package() {
  cd "${_gitname}"
  install -Dm644 "nativecontrol-1.2-fx.xpi" "/usr/lib/firefox/browser/extensions/native_control@karabaja4.xpi"
  install -Dm755 "app/native_control.js" "/usr/lib/mozilla/native-messaging-hosts/native_control.js"
  install -Dm644 "app/native_control.json" "/usr/lib/mozilla/native-messaging-hosts/native_control.json"
}
