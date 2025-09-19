
{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz") {} }:
let
  nodejs = pkgs.nodejs_20;
  pnpm = pkgs.nodePackages.pnpm;
in
pkgs.mkShell {
  name = "firebase-studio";
  buildInputs = with pkgs; [
    # Node.js and package managers
    nodejs
    pnpm

    # Firebase
    google-cloud-sdk
    
    # Playwright dependencies
    chromium
    firefox
    webkitgtk
    
    # Additional libraries needed by Playwright
    glib
    nss
    nspr
    cups
    libdrm
    libgbm
    libxkbcommon
    at-spi2-atk
    libxshmfence
    libepoxy
    libjpeg
    ffmpeg
    xorg.libX11
    xorg.libXcomposite
    xorg.libXcursor
    xorg.libXdamage
    xorg.libXext
    xorg.libXfixes
    xorg.libXi
    xorg.libXrandr
    xorg.libXrender
    xorg.libXtst
    xorg.libxcb
    xorg.libxkbfile
    xorg.libxmu
    xorg.xauth
    alsa-lib
    expat
    libdbusmenu
    gdk-pixbuf
    cairo
    pango
    gtk3
    udev
  ];

  shellHook = ''
    # Set the path for Playwright to find its browser binaries
    export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright.browsers}/
    # Set NPM config
    # this will create a .npmrc file in the project directory
    npm config set fund false
    npm config set audit false
    echo "Nix-shell environment is ready."
  '';
}
