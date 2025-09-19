
{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz") {} }:
let
  nodejs = pkgs.nodejs_20;
  pnpm = pkgs.nodePackages.pnpm;
  playwright-deps = with pkgs; [
    # Deps from https://playwright.dev/docs/ci#nix
    # and https://github.com/NixOS/nixpkgs/blob/nixos-unstable/pkgs/development/tools/testing/playwright/default.nix
    glibc
    zlib
    nss
    nspr
    cups
    expat
    dbus
    atk
    at-spi2-core
    cairo
    pango
    glib
    gtk3
    libdrm
    libgbm
    libxkbcommon
    xorg.libX11
    xorg.libXcomposite
    xorg.libXdamage
    xorg.libXfixes
    xorg.libXrandr
    xorg.libxkbfile
    xorg.libXrender
    xorg.libXtst
    alsa-lib
    libpulseaudio
    libopus
    libwebp
    ffmpeg
    harfbuzz
    udev
    fontconfig-ultimate
    # Extra deps from playwright install --with-deps chromium
    xorg.libXScrnSaver
  ];
in pkgs.mkShell {
  name = "firebase-studio";
  buildInputs = [
    nodejs
    pnpm
    pkgs.firebase-tools
  ] ++ playwright-deps;
}
