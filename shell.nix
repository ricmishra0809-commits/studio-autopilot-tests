{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz") {} }:
let
  nodejs = pkgs.nodejs_20;
  pnpm = pkgs.nodePackages.pnpm;
in
pkgs.mkShell {
  name = "firebase-studio";
  buildInputs = with pkgs; [
    # For Node.js and package management
    nodejs
    pnpm

    # For Playwright
    chromium
    ffmpeg
    glibc
    nss
    nspr
    dbus
    atk
    at-spi2-core
    cups
    libdrm
    libxkbcommon
    libXcomposite
    libXdamage
    libXfixes
    libXrandr
    libX11
    libXext
    pango
    cairo
    expat
    harfbuzz
    libglib
    libgobject
    libudev0-shim
    libusb
    gsettings-desktop-schemas
    gtk3
    libnotify
    libappindicator-gtk3
    libdbusmenu-gtk3
    webkitgtk_6_0
    libgbm
    xorg.libXScrnSaver
    xorg.libXv
    xorg.libxshmfence
    xorg.libXtst
    # Additional dependencies that might be needed
    alsa-lib
    fontconfig
    freetype
    libjpeg
    libpng
    libtiff
    libwebp
    zlib
  ];
  shellHook = ''
    # Set the PLAYWRIGHT_BROWSERS_PATH to the nix-managed chromium
    export PLAYWRIGHT_BROWSERS_PATH=${pkgs.chromium}/
    # Set other environment variables if needed
    export DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1
  '';
}
