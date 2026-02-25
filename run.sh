#!/bin/bash

echo "编译 C++ 后端..."
g++ -o backend/server backend/server.cpp -std=c++11

if [ $? -eq 0 ]; then
    echo "✅ 编译成功！"
    echo ""
    echo "启动后端服务器..."
    ./backend/server &
    SERVER_PID=$!
    
    echo "后端服务运行在: http://localhost:8080"
    echo "前端页面: file://$(pwd)/frontend/index.html"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    
    # 等待用户中断
    wait $SERVER_PID
else
    echo "❌ 编译失败"
    exit 1
fi
