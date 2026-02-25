#ifndef SOLAR_TERMS_H
#define SOLAR_TERMS_H

#include <cmath>

// 计算某年某节气的儒略日（精确算法）
double getSolarTermJD(int year, int term) {
    // 2000年各节气的儒略日基准（精确值）
    double base2000[] = {
        2451623.897, 2451639.390, 2451654.908, 2451670.337, 2451685.763, 2451701.343,
        2451716.563, 2451732.011, 2451747.484, 2451762.898, 2451778.393, 2451793.719,
        2451809.092, 2451824.652, 2451840.180, 2451855.597, 2451871.007, 2451886.580,
        2451901.895, 2451917.538, 2451933.120, 2451948.467, 2451963.887, 2451979.130
    };
    
    double jd = base2000[term] + 365.2422 * (year - 2000);
    double y = (year - 2000) / 1000.0;
    double correction = -0.00166 * sin(0.025 * (year - 2000) + 0.1 * term);
    
    return jd + correction;
}

// 公历日期时间转儒略日
double dateTimeToJD(int year, int month, int day, int hour) {
    if (month <= 2) {
        year--;
        month += 12;
    }
    int a = year / 100;
    int b = 2 - a + a / 4;
    double jd = floor(365.25 * (year + 4716)) + floor(30.6001 * (month + 1)) + day + b - 1524.5;
    jd += hour / 24.0;
    return jd;
}

// 根据公历日期时间计算节气月（精确到小时）
int getSolarMonth(int year, int month, int day, int hour) {
    double jd = dateTimeToJD(year, month, day, hour);
    
    // 12个节气及对应月份
    int terms[] = {0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22};
    int months[] = {12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11};
    
    // 检查当年小寒
    double xiaohanJD = getSolarTermJD(year, 0);
    if (jd < xiaohanJD) {
        return 12;
    }
    
    // 从后往前查找最近的已过节气
    for (int i = 11; i >= 0; i--) {
        double termJD = getSolarTermJD(year, terms[i]);
        if (jd >= termJD) {
            return months[i];
        }
    }
    
    return 12;
}

#endif
