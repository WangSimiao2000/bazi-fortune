# 称骨算命系统

基于生辰八字的称骨算命 Web 应用，使用 C++ 后端和 HTML/JavaScript 前端。

## 项目结构

```
bazi-fortune/
├── backend/
│   └── server.cpp          # C++ 后端服务器
├── frontend/
│   └── index.html          # Web 前端页面
├── run.sh                  # 一键运行脚本
└── README.md
```

## 功能特性

- ✅ 支持男女性别选择
- ✅ 根据出生年月日时计算骨重
- ✅ 显示对应的称骨诗（男女版本不同）
- ✅ 美观的 Web 界面
- ✅ C++ 高性能后端

## 快速开始

### 方法一：使用脚本（推荐）

```bash
cd bazi-fortune
./run.sh
```

### 方法二：手动运行

1. 编译后端：
```bash
g++ -o backend/server backend/server.cpp -std=c++11
```

2. 启动后端服务：
```bash
./backend/server
```

3. 在浏览器中打开前端页面：
```bash
# 使用浏览器打开
firefox frontend/index.html
# 或
google-chrome frontend/index.html
```

## 使用说明

1. 选择性别（男/女）
2. 输入出生年份（1924-2020）
3. 选择出生月份（农历）
4. 输入出生日期（1-30）
5. 选择出生时辰
6. 点击"开始算命"按钮
7. 查看骨重和对应性别的解命诗

## 技术栈

- **后端**: C++ (socket 编程)
- **前端**: HTML5 + CSS3 + JavaScript
- **通信**: HTTP REST API

## API 接口

### 计算骨重

```
GET /calculate?year={year}&month={month}&day={day}&hour={hour}&gender={gender}
```

参数：
- `gender`: male 或 female

响应示例：
```json
{
  "weight": 4.5,
  "poem": "福中取贵格求真，明敏才华志自伸，福禄寿全家道吉，桂兰毓秀晚荣臻。"
}
```

## 注意事项

- 后端服务运行在 `http://localhost:8080`
- 确保端口 8080 未被占用
- 需要 g++ 编译器支持 C++11 标准
- 输入的日期为农历日期

## 停止服务

按 `Ctrl+C` 停止后端服务器
