pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.gtk3
    pkgs.cairo
    pkgs.pango
    pkgs.gdk-pixbuf
    pkgs.sqlite
    pkgs.icu
    pkgs.libxslt
    pkgs.lcms2
    pkgs.libopus
    pkgs.libwebp
    pkgs.libjpeg
    pkgs.libpng
    pkgs.fontconfig
    pkgs.freetype
    pkgs.enchant
    pkgs.libsecret
    pkgs.libtasn1
    pkgs.hyphen
    pkgs.json-glib
    pkgs.gnutls
    pkgs.mesa
    pkgs.x264
    pkgs.xorg.libX11
    pkgs.xorg.libxcb
    pkgs.dbus

    # Playwright dependencies
    pkgs.nss
    pkgs.nspr
    pkgs.atk
    pkgs.at-spi2-atk
    pkgs.xorg.libXcomposite
    pkgs.xorg.libXdamage
    pkgs.xorg.libXfixes
    pkgs.xorg.libXrandr
    pkgs.gbm
    pkgs.xcb-util
    pkgs.xkbcommon
    pkgs.alsaLib
    pkgs.libudev
  ];
}
