{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz") {} }:
let
  nodejs = pkgs.nodejs_20;
  pnpm = pkgs.nodePackages.pnpm;
in
pkgs.mkShell {
  name = "firebase-studio";
  buildInputs = with pkgs; [
    nodejs
    pnpm
    # Playwright dependencies
    chromium
    firefox
    webkitgtk_6_0
    # System dependencies for Playwright
    glib
    nss
    nspr
    dbus
    libatk-1_0
    at-spi2-core
    libxkbcommon
    libX11
    libXcomposite
    libXdamage
    libXext
    libXfixes
    libXrandr
    libdrm
    libgbm
    udev
    alsa-lib
    pango
    cairo
    harfbuzz
  ];
  shellHook = ''
    export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}/
  '';
}
