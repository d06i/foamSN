@echo off

echo Installing Foam Graph...

echo Installing frontend (React)...
cd frontend
call npm install

echo if checking
if exist "build/" (
    echo old "build" directory deleting...
    rmdir /s /q "build"  
)

call npm run build
 if exist "build\" (
 echo Moving "build" directory to backend...
 move "build" "..\backend"

cd ..

echo Installing backend (Actix.rs)...
cd backend
cargo run --release

pause