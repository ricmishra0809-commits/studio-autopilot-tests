
{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/g8zzlf6drg73c987ii390yicq4c0j778.zip") {} }:
let
  nodejs = pkgs.nodejs-18_x;
  pnpm = pkgs.nodePackages.pnpm;
in pkgs.mkShell {
  name = "studio-shell";
  buildInputs = with pkgs; [
    nodejs
    pnpm
    # Additional dependencies for Playwright
    glib
    nspr
    nss
    dbus
    libatk
    atk-bridge
    expat
    at-spi2-atk
    libxkbcommon
    xorg.libX11
    xorg.libXcomposite
    xorg.libXdamage
    xorg.libXext
    xorg.libXfixes
    xorg.libXrandr
    xorg.libxcb
    udev
    alsa-lib
    pango
    cairo
    harfbuzz
    libdrm
    libgbm
  ];
  shellHook = ''
    # Set NPM config to use the Nix store
    export NPM_CONFIG_PREFIX=$(pwd)/.npm-packages
    export PATH=$NPM_CONFIG_PREFIX/bin:$PATH
    # Set Node-specific environment variables
    export NODE_PATH=$NODE_PATH:$(nix-build --no-out-link "<nixpkgs>" -A nodejs.pkgs.node_modules)/lib/node_modules
    echo "Nix-shell environment for Studio AutoPilot is ready."
    echo "Run 'npm run dev' and 'npm run genkit:watch' in separate terminals."
  '';
}
