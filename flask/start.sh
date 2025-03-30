set -e
userSupplied=false
if [ $1 ]; then
    userSupplied=true
    echo "Running $1"
    mv ./static/program/main.js ./static/program/stock-main.js
    cp $1 ./static/program/main.js
fi
python3.12 -m flask run
if [ $userSupplied = true ]; then
    rm ./static/program/main.js
    mv ./static/program/stock-main.js ./static/program/main.js
fi
