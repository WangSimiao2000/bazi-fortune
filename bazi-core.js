/**
 * 称骨核心：骨重表、阳历转农历、节气时刻、两种口径的换算。
 * 不碰页面，浏览器里以全局变量 BaziCore 使用，Node 里 require 进来跑测试（test/core.test.js）。
 *
 * 两种口径：
 *   lunar（农历，主流）：年 = 农历年（春节为界），月 = 农历月（闰月按本月），日 = 农历日
 *   solar（节气，八字）：年 = 干支年（立春为界），月 = 节气月（以「节」交接为界），日 = 农历日
 * 时辰两种口径相同：23:00 起算次日子时（日期加一天再取农历日）。
 * 所有时间都按北京时间（UTC+8）。
 */
(function (root) {
    'use strict';

    // ---------- 骨重表（袁天罡称骨歌） ----------

    /** 年按干支查，60 年一轮；下标 0 = 甲子 */
    const GANZHI = '甲子乙丑丙寅丁卯戊辰己巳庚午辛未壬申癸酉甲戌乙亥丙子丁丑戊寅己卯庚辰辛巳壬午癸未' +
        '甲申乙酉丙戌丁亥戊子己丑庚寅辛卯壬辰癸巳甲午乙未丙申丁酉戊戌己亥庚子辛丑壬寅癸卯' +
        '甲辰乙巳丙午丁未戊申己酉庚戌辛亥壬子癸丑甲寅乙卯丙辰丁巳戊午己未庚申辛酉壬戌癸亥';
    const YEAR_WEIGHT = [
        1.2, 0.9, 0.6, 0.7, 1.2, 0.5, 0.9, 0.8, 0.7, 0.8, // 甲子 - 癸酉
        1.5, 0.9, 1.6, 0.8, 0.8, 1.9, 1.2, 0.6, 0.8, 0.7, // 甲戌 - 癸未
        0.5, 1.5, 0.6, 1.6, 1.5, 0.7, 0.9, 1.2, 1.0, 0.7, // 甲申 - 癸巳
        1.5, 0.6, 0.5, 1.4, 1.4, 0.9, 0.7, 0.7, 0.9, 1.2, // 甲午 - 癸卯
        0.8, 0.7, 1.3, 0.5, 1.4, 0.5, 0.9, 1.7, 0.5, 0.7, // 甲辰 - 癸丑
        1.2, 0.8, 0.8, 0.6, 1.9, 0.6, 0.8, 1.6, 1.0, 0.6, // 甲寅 - 癸亥
    ];
    /** 月：1 = 正月 ... 12 = 腊月 */
    const MONTH_WEIGHT = { 1: 0.6, 2: 0.7, 3: 1.8, 4: 0.9, 5: 0.5, 6: 1.6, 7: 0.9, 8: 1.5, 9: 1.8, 10: 0.8, 11: 0.9, 12: 0.5 };
    const DAY_WEIGHT = {
        1: 0.5, 2: 1.0, 3: 0.8, 4: 1.5, 5: 1.6, 6: 1.5, 7: 0.8, 8: 1.6, 9: 0.8, 10: 1.6,
        11: 0.9, 12: 1.7, 13: 0.8, 14: 1.7, 15: 1.0, 16: 0.8, 17: 0.9, 18: 1.8, 19: 0.5, 20: 1.5,
        21: 1.0, 22: 0.9, 23: 0.8, 24: 0.9, 25: 1.5, 26: 1.8, 27: 0.7, 28: 0.8, 29: 1.6, 30: 0.6,
    };
    /** 时辰：0 = 子 ... 11 = 亥 */
    const SHICHEN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const HOUR_WEIGHT = [1.6, 0.6, 0.7, 1.0, 0.9, 1.6, 1.0, 0.8, 0.8, 0.9, 0.6, 0.6];

    const ganzhiIndex = (year) => (((year - 4) % 60) + 60) % 60;
    const ganzhiOf = (year) => GANZHI.substr(ganzhiIndex(year) * 2, 2);
    /** 钟点 0-23 -> 时辰序号（23 点和 0 点都是子时） */
    const shichenOf = (hour) => Math.floor(((hour + 1) % 24) / 2);

    // ---------- 农历（1900-2100） ----------

    /**
     * 每年一个数：低 4 位是闰哪个月（0 = 不闰），第 16 位是闰月大小（1 = 30 天），
     * 第 15..4 位依次是正月到腊月的大小。和浏览器内置的中国农历（ICU）逐日核对过，
     * 只有 1917、1922、1987 三年保留通行历书的闰月位置（ICU 放在相邻月份），这三年的农历日两边一致。
     */
    const LUNAR_INFO = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x16a95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04db0, 0x025b0, 0x18573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096e5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0bca4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x05270, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4f0, 0x05260, 0x0ea65, 0x0d520,
    0x0daa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
    0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
    0x092d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
    0x0d520,
    ];
    const MIN_DATE = Date.UTC(1900, 0, 31); // 农历 1900 年正月初一
    const MAX_YEAR = 2100;

    const yearInfo = (y) => LUNAR_INFO[y - 1900];
    const leapMonthOf = (y) => yearInfo(y) & 0xf;
    const leapDays = (y) => (leapMonthOf(y) ? ((yearInfo(y) & 0x10000) ? 30 : 29) : 0);
    const monthDays = (y, m) => ((yearInfo(y) & (0x10000 >> m)) ? 30 : 29);
    function lunarYearDays(y) {
        let sum = 348;
        for (let bit = 0x8000; bit > 0x8; bit >>= 1) sum += (yearInfo(y) & bit) ? 1 : 0;
        return sum + leapDays(y);
    }

    /** 阳历某天 -> 农历 { year, month, day, leap } */
    function solarToLunar(year, month, day) {
        let offset = Math.round((Date.UTC(year, month - 1, day) - MIN_DATE) / 864e5);
        if (offset < 0 || year > MAX_YEAR) throw new RangeError('只支持 1900 年 1 月 31 日到 2100 年');
        let y = 1900;
        while (offset >= lunarYearDays(y)) {
            offset -= lunarYearDays(y);
            y++;
        }
        const leap = leapMonthOf(y);
        for (let m = 1; m <= 12; m++) {
            let n = monthDays(y, m);
            if (offset < n) return { year: y, month: m, day: offset + 1, leap: false };
            offset -= n;
            if (m === leap) {
                n = leapDays(y);
                if (offset < n) return { year: y, month: m, day: offset + 1, leap: true };
                offset -= n;
            }
        }
        throw new Error('农历数据异常');
    }

    // ---------- 节气（太阳视黄经，Meeus 低精度算法，误差约十几分钟） ----------

    const rad = Math.PI / 180;
    /** ΔT = TT - UT（秒），按十年取值插值，1900 年以前和 2020 年以后外推 */
    const DT = [[1900, -2.8], [1910, 10.4], [1920, 21.2], [1930, 24.0], [1940, 24.3], [1950, 29.1], [1960, 33.1],
        [1970, 40.2], [1980, 50.5], [1990, 56.9], [2000, 63.8], [2010, 66.1], [2020, 69.4]];
    function deltaT(y) {
        if (y >= 2020) return 69.4 + 0.3 * (y - 2020);
        for (let i = 1; i < DT.length; i++) {
            if (y <= DT[i][0]) {
                const [y0, v0] = DT[i - 1], [y1, v1] = DT[i];
                return v0 + ((v1 - v0) * (y - y0)) / (y1 - y0);
            }
        }
        return DT[0][1];
    }
    /** UTC 毫秒 -> 太阳视黄经（度） */
    function sunLongitude(ms) {
        const y = new Date(ms).getUTCFullYear();
        const jd = ms / 864e5 + 2440587.5 + deltaT(y) / 86400;
        const T = (jd - 2451545) / 36525;
        const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
        const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * rad;
        const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
        const omega = (125.04 - 1934.136 * T) * rad;
        const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega);
        return ((lambda % 360) + 360) % 360;
    }
    /** 在 guess（UTC 毫秒）附近找太阳视黄经等于 target 的时刻 */
    function solveLongitude(target, guess) {
        let t = guess;
        for (let i = 0; i < 8; i++) {
            const diff = ((target - sunLongitude(t) + 540) % 360) - 180;
            t += (diff / 0.98564736) * 864e5;
            if (Math.abs(diff) < 1e-7) break;
        }
        return t;
    }
    /** 十二个「节」：节气月 m（1 = 正月）从黄经 315 + 30(m-1) 开始 */
    const JIE = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];
    /** 干支年 Y 的第 m 个节气月从哪个时刻开始（UTC 毫秒） */
    function jieTime(Y, m) {
        const guess = Date.UTC(Y, 1, 4) + (m - 1) * 30.44 * 864e5;
        return solveLongitude((315 + 30 * (m - 1)) % 360, guess);
    }
    /** 某一时刻（UTC 毫秒）所在的干支年和节气月，以及离它最近的那个节 */
    function solarTermMonth(ms) {
        const cy = new Date(ms + 8 * 3600e3).getUTCFullYear();
        const Y = ms >= jieTime(cy, 1) ? cy : cy - 1;
        let m = 12;
        for (let i = 2; i <= 12; i++) {
            if (ms < jieTime(Y, i)) {
                m = i - 1;
                break;
            }
        }
        const starts = [jieTime(Y, m), m < 12 ? jieTime(Y, m + 1) : jieTime(Y + 1, 1)];
        const nearest = Math.abs(ms - starts[0]) <= Math.abs(starts[1] - ms)
            ? { name: JIE[m - 1], at: starts[0] }
            : { name: JIE[m % 12], at: starts[1] };
        return { year: Y, month: m, nearest };
    }

    // ---------- 合起来 ----------

    const MONTH_NAMES = ['', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
    const DAY_NAMES = ['', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
        '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();

    /**
     * 阳历生辰 -> 称骨要用的年、月、日、时辰。
     * @param {{ year: number, month: number, day: number, hour: number, minute?: number }} birth 北京时间
     * @param {'lunar' | 'solar'} basis 口径
     */
    function resolve(birth, basis) {
        const { year, month, day, hour, minute = 0 } = birth;
        if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) throw new RangeError(`${year} 年 ${month} 月没有 ${day} 日`);
        const at = Date.UTC(year, month - 1, day, hour - 8, minute); // 北京时间 -> UTC
        // 23 点起算次日子时：农历日按次日取
        const dayAt = new Date(Date.UTC(year, month - 1, day) + (hour === 23 ? 864e5 : 0));
        const lunar = solarToLunar(dayAt.getUTCFullYear(), dayAt.getUTCMonth() + 1, dayAt.getUTCDate());
        const shichen = shichenOf(hour);
        const out = { lunar, shichen, nextDay: hour === 23, dayUsed: dayAt };
        if (basis === 'lunar') {
            out.year = lunar.year;
            out.month = lunar.month;
        } else {
            const st = solarTermMonth(at);
            out.year = st.year;
            out.month = st.month;
            out.term = st.nearest;
        }
        out.day = lunar.day;
        return out;
    }

    /** 四项骨重和总重 */
    function weigh({ year, month, day, shichen }) {
        const w = {
            year: YEAR_WEIGHT[ganzhiIndex(year)],
            month: MONTH_WEIGHT[month],
            day: DAY_WEIGHT[day],
            hour: HOUR_WEIGHT[shichen],
        };
        w.total = Math.round((w.year + w.month + w.day + w.hour) * 10) / 10;
        return w;
    }

    const api = {
        GANZHI, YEAR_WEIGHT, MONTH_WEIGHT, DAY_WEIGHT, HOUR_WEIGHT, SHICHEN, JIE, MONTH_NAMES, DAY_NAMES, LUNAR_INFO,
        ganzhiOf, ganzhiIndex, shichenOf, solarToLunar, sunLongitude, jieTime, solarTermMonth, resolve, weigh, daysInMonth,
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.BaziCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
