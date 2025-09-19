
{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz") {} }:

let
  nodejs = pkgs.nodejs_20;
  pnpm = pkgs.nodePackages.pnpm;
in
pkgs.mkShell {
  name = "firebase-studio";
  buildInputs = with pkgs; [
    # Node.js and package manager
    nodejs
    pnpm

    # Playwright dependencies
    # Source: https://playwright.dev/docs/ci#nix
    (playwright.override {
      browsers = ["chromium"];
    }).chromium

    # System libraries required by Playwright/Chromium
    alsa-lib
    at-spi2-atk
    at-spi2-core
    atk
    cairo
    cups
    dbus
    expat
    fontconfig
    freetype
    gdk-pixbuf
    glib
    gtk3
    libxkbcommon
    xorg.libXcomposite
    xorg.libXdamage
    xorg.libXfixes
    xorg.libXrandr
    xorg.libX11
    nspr
    nss
    pango
    udev
    libgbm
    webkitgtk_6_0
  ];

  shellHook = ''
    # Set NPM prefix to a local directory
    export NPM_CONFIG_PREFIX=$(pwd)/.npm-global
    export PATH=$NPM_CONFIG_PREFIX/bin:$PATH
  '';
}
