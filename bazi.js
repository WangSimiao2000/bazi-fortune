// 页面：读表单 -> BaziCore 换算和称重 -> 显示推算过程和称骨诗
const C = window.BaziCore;

const pad = (n) => String(n).padStart(2, '0');
/** UTC 毫秒 -> 北京时间「2月4日 20:35」 */
function bjTime(ms) {
    const d = new Date(ms + 8 * 3600e3);
    return `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月${d.getUTCDate()}日 ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}
const item = (label, html, warn = false) => `<div class="process-item${warn ? ' warn' : ''}"><strong>${label}：</strong>${html}</div>`;
const WARN = true;

function show(processHTML, weight, gender) {
    const poems = gender === 'male' ? malePoems : femalePoems;
    const poem = poems[weight.toFixed(1)] || '命运未知，请核对生辰八字。';
    for (const suffix of ['', 'Side']) {
        document.getElementById('processDisplay' + suffix).innerHTML = processHTML;
        document.getElementById('weightDisplay' + suffix).textContent = `骨重：${weight.toFixed(1)} 两`;
        document.getElementById('poemDisplay' + suffix).textContent = poem;
    }
    document.getElementById('result').classList.add('show');
    document.getElementById('resultContainer').classList.add('show');
}

function weightLines(r, w, monthLabel) {
    const f = (v) => v.toFixed(1);
    return item('年份骨重', `${r.year}年（${C.ganzhiOf(r.year)}）= ${f(w.year)} 两`) +
        item('月份骨重', `${monthLabel} = ${f(w.month)} 两`) +
        item('日期骨重', `农历${C.DAY_NAMES[r.day]} = ${f(w.day)} 两`) +
        item('时辰骨重', `${C.SHICHEN[r.shichen]}时 = ${f(w.hour)} 两`) +
        `<div class="process-sum">总计：${f(w.year)} + ${f(w.month)} + ${f(w.day)} + ${f(w.hour)} = ${w.total.toFixed(1)} 两</div>`;
}

document.getElementById('baziForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const gender = document.getElementById('gender').value;
    const mode = document.querySelector('input[name="inputMode"]:checked').value;

    if (mode === 'manual') {
        const r = {
            year: parseInt(document.getElementById('manualYear').value),
            month: parseInt(document.getElementById('solarMonth').value),
            day: parseInt(document.querySelector('input[name="lunarDay"]:checked').value),
            shichen: C.shichenOf(parseInt(document.getElementById('shiChen').value)),
        };
        const w = C.weigh(r);
        show(item('输入', '手动模式') + weightLines(r, w, C.MONTH_NAMES[r.month]), w.total, gender);
        return;
    }

    const basis = document.querySelector('input[name="basis"]:checked').value;
    const hour = parseInt(document.getElementById('hour').value);
    // 下拉框选的是一个时段（0 点和 23 点各 1 小时，其余 2 小时）；判断节气时取时段中点
    const span = hour === 0 || hour === 23 ? 60 : 120;
    const birth = {
        year: parseInt(document.getElementById('year').value),
        month: parseInt(document.getElementById('month').value),
        day: parseInt(document.getElementById('day').value),
        // 例如 01:00-02:59 取 02:00，23:00-23:59 取 23:30
        hour: span === 120 ? hour + 1 : hour,
        minute: span === 120 ? 0 : 30,
    };
    let r;
    try {
        r = C.resolve(birth, basis);
    } catch (err) {
        for (const suffix of ['', 'Side']) {
            document.getElementById('processDisplay' + suffix).innerHTML = item('输入有误', err.message, WARN);
            document.getElementById('weightDisplay' + suffix).textContent = '';
            document.getElementById('poemDisplay' + suffix).textContent = '请检查出生日期。';
        }
        document.getElementById('result').classList.add('show');
        document.getElementById('resultContainer').classList.add('show');
        return;
    }
    const w = C.weigh(r);
    const hourText = document.getElementById('hour').selectedOptions[0].textContent;
    const lunarText = `农历${r.lunar.year}年${r.lunar.leap ? '闰' : ''}${C.MONTH_NAMES[r.lunar.month]}${C.DAY_NAMES[r.lunar.day]}`;

    let html = item('输入', `阳历 ${birth.year}年${birth.month}月${birth.day}日 ${hourText}`);
    html += item('口径', basis === 'lunar' ? '农历（年按春节、月按农历月）' : '节气（年按立春、月按节气）');
    if (r.nextDay) {
        const d = r.dayUsed;
        html += item('时辰调整', `23 点起算次日子时，日期按 ${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月${d.getUTCDate()}日`, WARN);
    }
    html += item('阳历转农历', `<strong>${lunarText}</strong>`);

    let monthLabel;
    if (basis === 'lunar') {
        monthLabel = `农历${C.MONTH_NAMES[r.month]}`;
        if (r.lunar.leap) {
            monthLabel += '（闰月按本月）';
            html += item('闰月', `闰${C.MONTH_NAMES[r.month]}按${C.MONTH_NAMES[r.month]}算`, WARN);
        }
    } else {
        monthLabel = `节气${C.MONTH_NAMES[r.month]}（${C.JIE[r.month - 1]}后）`;
        html += item('节气', `${C.JIE[r.month - 1]}之后，属节气${C.MONTH_NAMES[r.month]}；干支年 ${r.year}年（${C.ganzhiOf(r.year)}）`);
        // 时辰内正好交节：只知道时辰、不知道几点几分时，月份（和立春前后的年份）可能算错
        const from = Date.UTC(birth.year, birth.month - 1, birth.day, hour - 8);
        const to = from + span * 60e3;
        if (r.term.at >= from - 30 * 60e3 && r.term.at <= to + 30 * 60e3) {
            html += item('注意', `${r.term.name}在 ${bjTime(r.term.at)}（北京时间，误差约十几分钟），正好落在这个时辰附近。请按具体出生时间判断是在${r.term.name}之前还是之后，必要时用手动模式。`, WARN);
        }
    }
    html += weightLines(r, w, monthLabel);
    show(html, w.total, gender);
});

// 模式切换
document.querySelectorAll('input[name="inputMode"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
        const mode = e.target.value;
        document.getElementById('solarMode').style.display = mode === 'solar' ? 'block' : 'none';
        document.getElementById('manualMode').style.display = mode === 'manual' ? 'block' : 'none';
    });
});
