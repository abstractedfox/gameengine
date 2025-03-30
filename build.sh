#Pass path to game root directory containing 'flask' as 1st argument

set -e

echo "Making destination 'out' directory. Will fail if this directory already exists"
mkdir out

echo "Using existing platform as base"
cp -r ./flask out

echo "Copying game files from within $1/flask"
cp -rf $1/flask/ ./out/flask/
