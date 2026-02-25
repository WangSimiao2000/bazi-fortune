@echo off
chcp 65001 >nul
echo 使用 CMake 构建项目...

if not exist build mkdir build
cd build
cmake .. -G "MinGW Makefiles"
cmake --build .
cd ..

if exist build\server.exe (
    echo ✅ 构建成功！
    echo.
    echo 启动服务器...
    start /B build\server.exe
    timeout /t 1 >nul
    start frontend\index.html
    echo.
    echo 按任意键停止服务器...
    pause >nul
    taskkill /F /IM server.exe >nul 2>&1
) else (
    echo ❌ 构建失败
    pause
)
