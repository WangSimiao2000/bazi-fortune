#ifndef SOLAR_TERMS_H
#define SOLAR_TERMS_H

// 根据公历日期计算节气月（1-12）
// 使用简化算法，误差在1-2天内
int getSolarMonth(int year, int month, int day) {
    // 节气月对应关系（使用平均日期）：
    // 立春(2月4日)→正月, 惊蛰(3月6日)→二月, 清明(4月5日)→三月
    // 立夏(5月6日)→四月, 芒种(6月6日)→五月, 小暑(7月7日)→六月
    // 立秋(8月8日)→七月, 白露(9月8日)→八月, 寒露(10月8日)→九月
    // 立冬(11月7日)→十月, 大雪(12月7日)→冬月, 小寒(1月6日)→腊月
    
    if (month == 1) {
        return (day >= 6) ? 12 : 11;  // 小寒后为腊月
    } else if (month == 2) {
        return (day >= 4) ? 1 : 12;   // 立春后为正月
    } else if (month == 3) {
        return (day >= 6) ? 2 : 1;    // 惊蛰后为二月
    } else if (month == 4) {
        return (day >= 5) ? 3 : 2;    // 清明后为三月
    } else if (month == 5) {
        return (day >= 6) ? 4 : 3;    // 立夏后为四月
    } else if (month == 6) {
        return (day >= 6) ? 5 : 4;    // 芒种后为五月
    } else if (month == 7) {
        return (day >= 7) ? 6 : 5;    // 小暑后为六月
    } else if (month == 8) {
        return (day >= 8) ? 7 : 6;    // 立秋后为七月
    } else if (month == 9) {
        return (day >= 8) ? 8 : 7;    // 白露后为八月
    } else if (month == 10) {
        return (day >= 8) ? 9 : 8;    // 寒露后为九月
    } else if (month == 11) {
        return (day >= 7) ? 10 : 9;   // 立冬后为十月
    } else { // month == 12
        return (day >= 7) ? 11 : 10;  // 大雪后为冬月
    }
}

#endif
