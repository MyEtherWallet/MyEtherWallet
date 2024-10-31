for f in release/*; do
  gpg --output $f.sig --detach-sig $f
done