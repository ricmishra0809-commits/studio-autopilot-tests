{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
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
  ];
}
