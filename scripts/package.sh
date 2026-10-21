#!/usr/bin/env bash
# Valida a extensão e gera dist/resolve-ai-<versão>.zip para enviar à Chrome Web Store.
set -euo pipefail
cd "$(dirname "$0")/.."

node -e 'JSON.parse(require("fs").readFileSync("extension/manifest.json","utf8"))'
for f in $(find extension -name '*.js'); do node --check "$f"; done
for s in 16 32 48 128; do test -f "extension/icons/icon$s.png"; done

version=$(node -p 'require("./extension/manifest.json").version')
mkdir -p dist
out="dist/resolve-ai-$version.zip"
rm -f "$out"
(cd extension && zip -qr "../$out" . -x '.*')
echo "Pacote gerado: $out"
