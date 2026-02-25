// 称骨重量表
const yearWeight = {
    1924:1.2, 1925:0.9, 1926:1.6, 1927:0.7, 1928:1.2, 1929:0.5, 1930:0.9, 1931:0.8,
    1932:0.7, 1933:0.7, 1934:0.8, 1935:0.9, 1936:0.6, 1937:0.7, 1938:1.9, 1939:1.2,
    1940:0.8, 1941:0.6, 1942:0.8, 1943:0.7, 1944:0.5, 1945:1.5, 1946:0.6, 1947:1.6,
    1948:1.5, 1949:0.7, 1950:0.9, 1951:1.2, 1952:1.0, 1953:0.7, 1954:1.5, 1955:0.6,
    1956:0.5, 1957:1.4, 1958:1.4, 1959:0.9, 1960:0.7, 1961:0.7, 1962:0.9, 1963:1.2,
    1964:0.8, 1965:0.7, 1966:1.3, 1967:0.5, 1968:1.4, 1969:0.5, 1970:0.9, 1971:1.7,
    1972:0.5, 1973:0.7, 1974:1.2, 1975:0.8, 1976:0.8, 1977:0.6, 1978:1.9, 1979:0.6,
    1980:0.8, 1981:1.6, 1982:1.0, 1983:0.7, 1984:1.2, 1985:0.9, 1986:0.6, 1987:0.7,
    1988:1.2, 1989:0.5, 1990:0.9, 1991:0.8, 1992:0.7, 1993:0.8, 1994:1.5, 1995:0.9,
    1996:1.6, 1997:0.8, 1998:0.8, 1999:1.9, 2000:1.2, 2001:0.6, 2002:0.8, 2003:0.7,
    2004:0.5, 2005:1.5, 2006:0.6, 2007:1.6, 2008:1.5, 2009:0.7, 2010:0.9, 2011:1.2,
    2012:1.0, 2013:0.7, 2014:1.5, 2015:0.6, 2016:0.5, 2017:1.4, 2018:1.4, 2019:0.9, 2020:0.7
};

const monthWeight = {1:0.6, 2:0.7, 3:1.8, 4:0.9, 5:0.5, 6:1.6, 7:0.9, 8:1.5, 9:1.8, 10:0.8, 11:0.9, 12:0.5};

const dayWeight = {
    1:0.5, 2:1.0, 3:0.8, 4:1.5, 5:1.6, 6:1.5, 7:0.8, 8:1.6, 9:0.8, 10:1.6,
    11:0.9, 12:1.7, 13:0.8, 14:1.7, 15:1.0, 16:0.8, 17:0.9, 18:1.8, 19:0.5, 20:1.5,
    21:1.0, 22:0.9, 23:0.8, 24:0.9, 25:1.5, 26:1.8, 27:0.7, 28:0.8, 29:1.6, 30:0.6
};

const hourWeight = {
    0:1.6, 1:0.6, 2:0.6, 3:0.7, 4:1.0, 5:0.9, 6:1.6, 7:0.8, 8:0.8, 9:1.6, 10:0.9, 11:1.0,
    12:1.0, 13:0.8, 14:0.8, 15:0.9, 16:0.6, 17:0.7, 18:1.0, 19:0.6, 20:0.6, 21:0.7, 22:0.8, 23:0.9
};

// 称骨诗 - 男命和女命（简化版，实际应包含完整数据）
const malePoems = {
    "2.1": "短命非业谓大凶，平生灾难事重重，凶祸频临陷逆境，终世困苦事不成。",
    "6.3": "命主为官福禄长，得来富贵定非常，名题金塔传金榜，定中高科天下扬。"
    // ... 其他诗句
};

const femalePoems = {
    "2.1": "生辰八字不相宜，此命推来路途艰，女子独守空房内，夫君远走不归还。",
    "6.3": "女命推来福气宏，婚姻美满子孙兴，夫君有情家业旺，晚年荣华福禄增。"
    // ... 其他诗句
};

// 农历数据表
const lunarInfo = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
    0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
    0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
    0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
    0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
    0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
    0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252
];

// 节气计算（简化版）
function getSolarMonth(year, month, day, hour) {
    // 简化算法：基于固定日期
    const solarTermDays = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];
    
    if (month === 1) return day >= solarTermDays[0] ? 12 : 11;
    if (month === 2) return day >= solarTermDays[1] ? 1 : 12;
    if (month === 3) return day >= solarTermDays[2] ? 2 : 1;
    if (month === 4) return day >= solarTermDays[3] ? 3 : 2;
    if (month === 5) return day >= solarTermDays[4] ? 4 : 3;
    if (month === 6) return day >= solarTermDays[5] ? 5 : 4;
    if (month === 7) return day >= solarTermDays[6] ? 6 : 5;
    if (month === 8) return day >= solarTermDays[7] ? 7 : 6;
    if (month === 9) return day >= solarTermDays[8] ? 8 : 7;
    if (month === 10) return day >= solarTermDays[9] ? 9 : 8;
    if (month === 11) return day >= solarTermDays[10] ? 10 : 9;
    return day >= solarTermDays[11] ? 11 : 10;
}

// 阳历转农历日
function solarToLunarDay(year, month, day) {
    // 简化实现：返回近似值
    // 实际应使用完整的农历算法
    const offset = Math.floor((day + month * 2.5) % 30) + 1;
    return Math.min(offset, 30);
}

// 表单提交
document.getElementById('baziForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const gender = document.getElementById('gender').value;
    let year = parseInt(document.getElementById('year').value);
    let month = parseInt(document.getElementById('month').value);
    let day = parseInt(document.getElementById('day').value);
    let hour = parseInt(document.getElementById('hour').value);
    
    const inputYear = year, inputMonth = month, inputDay = day, inputHour = hour;
    
    // 处理23点
    if (hour === 23) {
        hour = 0;
        day++;
        const monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) monthDays[2] = 29;
        if (day > monthDays[month]) {
            day = 1;
            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
        }
    }
    
    // 计算
    const solarMonth = getSolarMonth(year, month, day, hour);
    const lunarDay = solarToLunarDay(year, month, day);
    
    const yearW = yearWeight[year] || 0;
    const monthW = monthWeight[solarMonth] || 0;
    const dayW = dayWeight[lunarDay] || 0;
    const hourW = hourWeight[hour] || 0;
    
    const weight = yearW + monthW + dayW + hourW;
    const weightKey = weight.toFixed(1);
    const poems = gender === 'male' ? malePoems : femalePoems;
    const poem = poems[weightKey] || "命运未知，请核对生辰八字。";
    
    // 显示结果
    const monthNames = ['', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
    const hourNames = ['子时', '丑时', '丑时', '寅时', '寅时', '卯时', '卯时', '辰时', '辰时', '巳时', '巳时', '午时', '午时', '未时', '未时', '申时', '申时', '酉时', '酉时', '戌时', '戌时', '亥时', '亥时', '子时'];
    
    const is23Hour = inputHour === 23;
    const displayDate = is23Hour ? `${year}年${month}月${day}日` : `${inputYear}年${inputMonth}月${inputDay}日`;
    
    let processHTML = `
        <div class="process-item">
            <strong>输入：</strong>阳历 ${inputYear}年${inputMonth}月${inputDay}日 ${inputHour}:00-${inputHour}:59
        </div>
    `;
    
    if (is23Hour) {
        processHTML += `<div class="process-item" style="color: #667eea;">
            <strong>时辰调整：</strong>23点算次日子时 → ${displayDate} 子时
        </div>`;
    }
    
    processHTML += `
        <div class="process-item">
            <strong>阳历转农历：</strong>${displayDate} → 农历 <strong>${lunarDay}日</strong>
        </div>
        <div class="process-item">
            <strong>节气转换：</strong>${displayDate} ${hourNames[hour]} → 节气月 <strong>${monthNames[solarMonth]}</strong>
        </div>
        <div class="process-item">
            <strong>年份骨重：</strong>${year}年 = ${yearW} 两
        </div>
        <div class="process-item">
            <strong>月份骨重：</strong>${monthNames[solarMonth]} = ${monthW} 两
        </div>
        <div class="process-item">
            <strong>日期骨重：</strong>农历${lunarDay}日 = ${dayW} 两
        </div>
        <div class="process-item">
            <strong>时辰骨重：</strong>${hourNames[hour]} = ${hourW} 两
        </div>
        <div class="process-sum">
            总计：${yearW} + ${monthW} + ${dayW} + ${hourW} = ${weight.toFixed(1)} 两
        </div>
    `;
    
    document.getElementById('processDisplay').innerHTML = processHTML;
    document.getElementById('weightDisplay').textContent = `骨重：${weight.toFixed(1)} 两`;
    document.getElementById('poemDisplay').textContent = poem;
    document.getElementById('result').classList.add('show');
});
