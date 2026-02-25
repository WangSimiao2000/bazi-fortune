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
- ✅ 输入阳历生日，自动计算节气月份
- ✅ 根据生辰八字计算骨重
- ✅ 显示对应的称骨诗（男女版本不同）
- ✅ 美观的 Web 界面
- ✅ C++ 高性能后端

## 快速开始

### Windows 系统

**方法一：直接编译运行**
```cmd
run.bat
```

**方法二：使用 CMake（推荐）**
```cmd
build.bat
```

### Linux/Mac 系统

**方法一：直接编译运行**
```bash
./run.sh
```

**方法二：使用 CMake（推荐）**
```bash
./build.sh
```

### 前置要求

- **Windows**: MinGW-w64 或 MSVC（需包含 g++ 或 cl）
- **Linux**: g++ 编译器
- **Mac**: Xcode Command Line Tools
- **可选**: CMake 3.10+（用于 CMake 构建方式）

## 使用说明

1. 选择性别（男/女）
2. 输入阳历（公历）出生年月日
3. 选择出生时辰
4. 点击"开始算命"按钮
5. 系统自动计算节气月份并显示结果

### 节气自动计算

系统会根据输入的阳历日期，自动计算对应的节气月份：
- 使用天文算法精确计算每年的节气时间
- 自动判断出生日期所属的节气月
- 无需手动查询或转换

**示例**：
- 输入：2000年11月6日 → 自动识别为九月（寒露月）
- 输入：1990年2月3日 → 自动识别为腊月（小寒月）

## 技术栈

- **后端**: C++ (跨平台 socket 编程)
- **前端**: HTML5 + CSS3 + JavaScript
- **通信**: HTTP REST API
- **构建**: CMake (跨平台) / 直接编译

## API 接口

### API 接口

```
GET /calculate?year={year}&month={month}&day={day}&hour={hour}&gender={gender}
```

参数：
- `year`, `month`, `day`: 阳历日期
- `hour`: 时辰（0-23）
- `gender`: male 或 female

响应示例：
```json
{
  "weight": 4.5,
  "solarMonth": 9,
  "poem": "福中取贵格求真，明敏才华志自伸，福禄寿全家道吉，桂兰毓秀晚荣臻。"
}
```

## 注意事项

- 后端服务运行在 `http://localhost:8080`
- 确保端口 8080 未被占用
- Windows 需要 MinGW 或 MSVC 编译器
- Linux/Mac 需要 g++ 编译器
- 输入阳历（公历）日期，系统自动计算节气月份
- 支持年份范围：1900-2100

## 停止服务

- **Windows**: 按任意键或 Ctrl+C
- **Linux/Mac**: 按 Ctrl+C
