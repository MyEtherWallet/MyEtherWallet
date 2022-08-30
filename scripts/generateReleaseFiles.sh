#!/bin/sh
RELEASE="$1"
cd dist && zip -r ../release/MyEtherWallet-$RELEASE.zip * && cd ..
if [ -n "$2" ]; then
    for f in release/*; do
        gpg --output $f.sig --detach-sig $f
    done
fi