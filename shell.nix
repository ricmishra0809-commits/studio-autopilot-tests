
{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz") {} }:
let
  nodejs = pkgs.nodejs_20;
  pnpm = pkgs.nodePackages.pnpm;
  # For webkit-based browsers
  webkitgtk_6_0 = pkgs.webkitgtk_6_0;

in pkgs.mkShell {
  name = "firebase-studio";
  buildInputs = with pkgs; [
    # General deps
    bash
    coreutils
    gnumake
    # Node.js and pnpm
    nodejs
    pnpm
    # Firebase
    firebase-tools
    # Playwright deps
    glib
    dbus
    atk
    at-spi2-core
    nss
    nspr
    libxkbcommon
    xorg.libXcomposite
    xorg.libXdamage
    xorg.libXfixes
    libXrandr
    libX11
    libdrm
    libgbm
    udev
    pango
    cairo
    harfbuzz
    alsa-lib
    # For firefox
    ffmpeg
    # For webkit
    webkitgtk_6_0
  ];
  shellHook = ''
    # Allow looking for native dependencies in the path
    export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright.browsersPath}
    export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath buildInputs}:$LD_LIBRARY_PATH"
    export FONTCONFIG_FILE="${pkgs.fontconfig.makeFontsConf { fontDirectories = [ pkgs.dejavu_fonts ]; }}"
  '';
}
