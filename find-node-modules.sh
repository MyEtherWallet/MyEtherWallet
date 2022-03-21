if [ -d "./node_modules" ]
then
  find node_modules -name ".git" -exec rm -rf {} \;
fi