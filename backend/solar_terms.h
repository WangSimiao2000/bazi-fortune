#ifndef SOLAR_TERMS_H
#define SOLAR_TERMS_H

#include <map>
#include <string>

using namespace std;

// 节气月份对照表（部分年份示例，实际应用需完整数据）
// 格式: "YYYYMMDD" -> 节气月份
map<string, map<string, int>> solarTermMonths = {
    {"2000", {
        {"0104", 11}, {"0205", 12}, {"0305", 1}, {"0405", 2}, {"0505", 3}, {"0605", 4},
        {"0707", 5}, {"0807", 6}, {"0908", 7}, {"1008", 8}, {"1107", 9}, {"1207", 10}
    }},
    // 可以继续添加其他年份...
};

// 简化版：根据公历月份估算节气月
int getSolarMonth(int year, int month, int day) {
    // 节气大致日期（简化版）
    int solarTermDays[] = {6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7}; // 每月节气大致日期
    
    // 如果在节气日之前，使用上个月
    if (day < solarTermDays[month - 1]) {
        month = (month == 1) ? 12 : month - 1;
    }
    
    // 转换为节气月（立春为正月）
    // 公历1月小寒→农历11月, 2月立春→农历1月
    int solarMonth = month - 1;
    if (solarMonth == 0) solarMonth = 12;
    if (solarMonth == -1) solarMonth = 11;
    
    return solarMonth;
}

#endif
