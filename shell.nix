{ pkgs ? import <nixpkgs> { } }:
let
  nodejs = pkgs.nodejs-20_x;
  pnpm = pkgs.nodePackages.pnpm;
  firebase-tools = pkgs.nodePackages.firebase-tools;

  playwright-deps = with pkgs; [
    # Deps from https://playwright.dev/docs/ci#nix
    xorg.libX11
    xorg.libXcomposite
    xorg.libXdamage
    xorg.libXext
    xorg.libXfixes
    xorg.libXrandr
    xorg.libXtst
    xorg.libxkbcommon
    xorg.libxcb
    nss
    nspr
    alsa-lib
    at-spi2-atk
    cups
    libexpat
    libuuid
    libdrm
    libgbm
    libxkbcommon
    mesa
    pango
    pipewire
    udev
  ];

in
  pkgs.mkShell {
    buildInputs = [
      nodejs
      pnpm
      firebase-tools
      pkgs.google-cloud-sdk
    ] ++ playwright-deps;

    shellHook = ''
      export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright.browsers-json}/.
    '';
  }
