{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/release-23.11.tar.gz") {} }:

pkgs.mkShell {
  # The Nix packages we need
  buildInputs = with pkgs; [
    nodejs_20 # Node.js version 20
    # Playwright dependencies
    libglib
    gobject-introspection
    libnspr
    libnss
    nss_latest.nss_util
    dbus-glib
    dbus
    atk
    at-spi2-core
    libexpat
    at-spi2-atk
    xorg.libX11
    xorg.libXcomposite
    xorg.libXdamage
    xorg.libXext
    xorg.libXfixes
    xorg.libXrandr
    libgbm
    xorg.libxcb
    libxkbcommon
    udev
    alsa-lib
    cairo
    pango
    harfbuzz
  ];
}
