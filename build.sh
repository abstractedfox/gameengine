#Pass path to game root directory containing 'flask' as 1st argument

set -e

mkdir out
cp -r ./flask out
cp -rf $1/flask/ ./out/flask/
