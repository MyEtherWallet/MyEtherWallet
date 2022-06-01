#!/bin/sh
RELEASE="$1"
cd dist && zip -r ../release/MyEtherWallet-$RELEASE.zip * && cd ..
if [ -n "$4" ]; then
    for f in release/*; do
        gpg --output $f.sig --detach-sig $f
    done
fi