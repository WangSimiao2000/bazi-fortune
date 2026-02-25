@echo off
chcp 65001 >nul
echo 编译 C++ 后端...

g++ -o backend\server.exe backend\server.cpp -std=c++11 -lws2_32

if %errorlevel% equ 0 (
    echo ✅ 编译成功！
    echo.
    echo 启动后端服务器...
    start /B backend\server.exe
    echo 后端服务运行在: http://localhost:8080
    echo 前端页面: %cd%\frontend\index.html
    echo.
    echo 在浏览器中打开前端页面...
    start frontend\index.html
    echo.
    echo 按任意键停止服务器...
    pause >nul
    taskkill /F /IM server.exe >nul 2>&1
) else (
    echo ❌ 编译失败
    pause
)
