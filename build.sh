#!/bin/bash

echo "使用 CMake 构建项目..."

mkdir -p build
cd build
cmake ..
cmake --build .
cd ..

if [ -f build/server ]; then
    echo "✅ 构建成功！"
    echo ""
    echo "启动服务器..."
    ./build/server &
    SERVER_PID=$!
    
    echo "后端服务运行在: http://localhost:8080"
    echo "前端页面: file://$(pwd)/frontend/index.html"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    
    wait $SERVER_PID
else
    echo "❌ 构建失败"
    exit 1
fi
