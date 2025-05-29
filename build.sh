echo "Installing FoamSN Graph..."

echo "Installing frontend (React)..."
cd frontend || exit
npm install

if [ -d "build" ]; then
    echo "old 'build' directory deleting..."
    rm -rf build
fi    

npm run build
if [ -d build]; then
    echo "Moving 'build' directory to backend..."
    mv build ../backend/
fi

cd ..

echo "Installing backend (Actix.rs)..."
cd backend
cargo run --release 

read -p "Press enter to continue..."