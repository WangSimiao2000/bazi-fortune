// 跑法：node --test test/   （只用 Node 自带的测试框架和 ICU 农历，不装依赖）
const { test } = require('node:test');
const assert = require('node:assert/strict');
const C = require('../bazi-core.js');

const bj = (ms) => new Date(ms + 8 * 3600e3).toISOString().slice(0, 16).replace('T', ' ');

test('阳历转农历：1901-2100 年逐日和 ICU 农历一致', () => {
    const f = new Intl.DateTimeFormat('en-u-ca-chinese', { timeZone: 'Asia/Shanghai', year: 'numeric', month: 'numeric', day: 'numeric' });
    const bad = [];
    for (let t = Date.UTC(1901, 1, 19); t <= Date.UTC(2100, 11, 31); t += 864e5) {
        const d = new Date(t);
        const p = Object.fromEntries(f.formatToParts(new Date(t + 4 * 3600e3)).map((x) => [x.type, x.value]));
        const r = C.solarToLunar(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
        const y = d.getUTCFullYear();
        // 1917、1922、1987 三年通行历书和 ICU 闰月放的位置不同（农历日一致），只比年和日
        const skipMonth = [1917, 1922, 1987].includes(y);
        const ok = r.year === +p.relatedYear && r.day === +p.day &&
            (skipMonth || (r.month === parseInt(p.month) && r.leap === /bis/.test(p.month)));
        if (!ok) bad.push(`${d.toISOString().slice(0, 10)} ${JSON.stringify(r)} ICU ${p.relatedYear}/${p.month}/${p.day}`);
    }
    assert.deepEqual(bad.slice(0, 5), []);
});

test('闰月：2020 年闰四月', () => {
    assert.deepEqual(C.solarToLunar(2020, 5, 23), { year: 2020, month: 4, day: 1, leap: true });
    assert.deepEqual(C.solarToLunar(2020, 6, 21), { year: 2020, month: 5, day: 1, leap: false });
});

test('骨重表：年按干支，60 年一轮；时辰表', () => {
    assert.equal(C.YEAR_WEIGHT.length, 60);
    assert.equal(C.ganzhiOf(1984), '甲子');
    assert.equal(C.ganzhiOf(1926), '丙寅');
    assert.equal(C.YEAR_WEIGHT[C.ganzhiIndex(1926)], 0.6);
    assert.equal(C.YEAR_WEIGHT[C.ganzhiIndex(1986)], 0.6);
    assert.deepEqual(C.HOUR_WEIGHT, [1.6, 0.6, 0.7, 1.0, 0.9, 1.6, 1.0, 0.8, 0.8, 0.9, 0.6, 0.6]);
    assert.equal(C.shichenOf(23), 0);
    assert.equal(C.shichenOf(0), 0);
    assert.equal(C.shichenOf(1), 1);
    assert.equal(C.shichenOf(22), 11);
});

test('节气：十二个节按时间先后排列，立春都在 2 月 3-5 日', () => {
    for (let y = 1901; y <= 2099; y++) {
        let prev = -Infinity;
        for (let m = 1; m <= 12; m++) {
            const t = C.jieTime(y, m);
            assert.ok(t > prev, `${y} 第 ${m} 个节`);
            prev = t;
        }
        const d = new Date(C.jieTime(y, 1) + 8 * 3600e3);
        assert.ok(d.getUTCMonth() === 1 && d.getUTCDate() >= 3 && d.getUTCDate() <= 5, `${y} 立春 ${bj(C.jieTime(y, 1))}`);
    }
});

test('节气：和公布的交节时刻相差不到 15 分钟', () => {
    // 北京时间
    const known = [
        [2000, 1, '2000-02-04 20:40'],
        [2021, 1, '2021-02-03 22:59'],
        [2024, 1, '2024-02-04 16:27'],
        [2025, 1, '2025-02-03 22:10'],
        [2026, 1, '2026-02-04 04:02'],
    ];
    for (const [y, m, s] of known) {
        const want = Date.parse(s.replace(' ', 'T') + ':00+08:00');
        const got = C.jieTime(y, m);
        assert.ok(Math.abs(got - want) < 15 * 60e3, `${y} ${C.JIE[m - 1]} 算出 ${bj(got)}，公布 ${s}`);
    }
});

test('两种口径：立春后、春节前出生', () => {
    // 2000 年立春 2 月 4 日 20:40，春节 2 月 5 日
    const noon = { year: 2000, month: 2, day: 4, hour: 12 };
    const night = { year: 2000, month: 2, day: 4, hour: 22 };
    const l = C.resolve(night, 'lunar');
    assert.deepEqual([l.year, l.month, l.day], [1999, 12, 29]);
    const s1 = C.resolve(noon, 'solar');
    assert.deepEqual([s1.year, s1.month], [1999, 12]);
    const s2 = C.resolve(night, 'solar');
    assert.deepEqual([s2.year, s2.month, s2.day], [2000, 1, 29]);
});

test('23 点起算次日子时：除夕 23 点已是正月初一', () => {
    const r = C.resolve({ year: 2000, month: 2, day: 4, hour: 23, minute: 30 }, 'lunar');
    assert.deepEqual([r.year, r.month, r.day, r.shichen, r.nextDay], [2000, 1, 1, 0, true]);
});

test('闰月按本月算；称重求和', () => {
    const r = C.resolve({ year: 2020, month: 5, day: 23, hour: 12 }, 'lunar');
    assert.deepEqual([r.year, r.month, r.day, r.lunar.leap], [2020, 4, 1, true]);
    const w = C.weigh(r);
    assert.deepEqual(w, { year: 0.7, month: 0.9, day: 0.5, hour: 1.0, total: 3.1 });
});

test('不存在的日期报错', () => {
    assert.throws(() => C.resolve({ year: 2023, month: 2, day: 29, hour: 12 }, 'lunar'), /没有 29 日/);
    assert.throws(() => C.resolve({ year: 1899, month: 6, day: 1, hour: 12 }, 'lunar'), RangeError);
});
