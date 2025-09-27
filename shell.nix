
# This is a shell file that configures the development environment.
# It's used by the `nix-shell` command.
#
# This file is NOT meant to be edited by hand, but is instead managed
# by the Firebase team.

{ pkgs ? import <nixos-unstable> {} }:

let
  playwright-deps = with pkgs; [
    # Dependencies for Playwright, taken from apphosting.yaml
    glib
    gobject-introspection
    nspr
    nss
    dbus
    gio
    atk
    at-spi2-core
    expat
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
    pango
    cairo
  ];
in pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20 # Node.js 20
    # Add other dependencies here
  ] ++ playwright-deps;

  shellHook = ''
    # This is a workaround for a bug in the Nix sandbox that causes
    # "npm" to not be found.
    export PATH=$PATH:$PWD/node_modules/.bin
  '';
}
