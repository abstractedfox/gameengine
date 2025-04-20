set -e
run=false

while [[ $# -gt 1 ]]; do
    case $1 in
        -help|-h)
            echo "start.sh help:"
            echo "start.sh [args] /path/to/root/directory/of/game/repo/"
            echo "-clean / -c: Remove the existing 'out' directory before building"
            echo "-run / -r: Run immediately after building"
            echo "-help / -h: Display this message"
            shift 
            ;;

        -clean|-c)
            echo "Building clean"
            rm -rf out
            shift
            ;;
        
        -run|-r)
            run=true 
            shift
            ;;
    
    esac
done

echo "Making destination 'out' directory."
mkdir out

echo "Using existing platform as base"
cp -r ./flask out

echo "Copying game files from within $1/flask"
cp -rf $1/flask/ ./out/flask/

if [ $run ]; then
    cd ./out/flask/
    ./start.sh
fi
