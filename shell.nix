{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/3a149435017c68097063f25d77420e6c46649887.tar.gz") {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20
    # Playwright dependencies from apphosting.yaml
    glib
    gobject-introspection # for libgio-2.0
    nspr
    nss
    dbus
    # libglib is covered by glib
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
    mesa # for libgbm
    xorg.libxcb
    libxkbcommon
    udev # for libudev
    alsa-lib # for libasound
    pango
    cairo
    harfbuzz
  ];

  shellHook = ''
    export PLAYWRIGHT_BROWSERS_PATH=$PWD/pw-browsers
  '';
}
