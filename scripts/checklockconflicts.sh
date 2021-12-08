if grep -Fxq "<<<<<<< HEAD" package-lock.json
then
    echo "Conflict found! Fixing...."
    npm install --package-lock-only --ignore-scripts
    echo "Fixed!"
else
    echo "No conflicts found in package-lock.json!"
fi
