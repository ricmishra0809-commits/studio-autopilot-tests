{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-23.11.tar.gz") {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20 # Node.js 20.x

    # Playwright dependencies from apphosting.yaml, corrected for Nix
    glib
    gobject-introspection
    nspr
    nss
    dbus
    atk
    at-spi2-atk
    expat
    at-spi2-core
    libx11
    libxcomposite
    libxdamage
    libxext
    libxfixes
    libxrandr
    libgbm
    libxcb
    libxkbcommon
    udev
    alsa-lib
    pango
    cairo
    harfbuzz
    # libcups is not found by this name, `cups` is the package. But it's often not a hard requirement.
    # We will add it if playwright still complains.
  ];
}
