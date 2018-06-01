echo "Remove gitignore";
rm .gitignore;

echo "Rebuild app";
npm run build;
# openssl aes-256-cbc -K $encrypted_85fecf66b314_key -iv $encrypted_85fecf66b314_iv -in mew.gpg.enc -out mew.gpg -d;
echo "Create deploy forder";
sudo mkdir deploy;
# gpg --allow-secret-key-import --import mew.gpg;
echo "Zip file with package version";
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]');

sudo zip -r ./deploy/release-"$PACKAGE_VERSION".zip ./dist;

# for f in deploy/*; do
#   gpg --output $f.sig --detach-sig $f
# done;x
echo "Create and push tags";
git tag v$PACKAGE_VERSION; git push --tags;
