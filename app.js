'use strict';

/* ---------- Constants & seed data ---------- */

const STORE_KEY = 'posture-checkin-v1';
const SOURCES = ['Pamela', '周六野', '其他'];
const ISSUES = ['圆肩', '驼背', '头前伸', '骨盆前倾', '高低肩', '其他'];
const WEEK = ['一', '二', '三', '四', '五', '六', '日'];
const ICS_DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

// Generic posture moves. `video` is a suggested full routine from that creator
// (checked to exist and to be on their own channel); moves without one are left
// for the user to link.
const SEED = [
  { id: 'wall-angel', name: '靠墙天使', source: 'Pamela', issue: '圆肩', dose: '3 组 × 10 次', secs: 90, video: 'https://www.youtube.com/watch?v=Wdq_pRXwg_8',
    intro: '激活中下斜方肌，打开胸椎，改善含胸和肩膀前扣。',
    steps: ['后脑、上背、臀部贴墙，脚跟离墙约一脚掌', '手臂呈 W 形贴墙，手背和手肘尽量不离墙', '呼气时手臂沿墙缓慢上滑成 Y，再回到 W', '全程腰背不拱起，肋骨下沉'],
    mistakes: '耸肩、腰部离墙、为了贴墙而用力过猛。做不到完全贴墙没关系，范围会慢慢变大。' },
  { id: 'cat-cow', name: '猫牛式', source: '周六野', issue: '驼背', dose: '10 次 · 慢速', secs: 60, video: 'https://www.bilibili.com/video/BV1yb42147p1',
    intro: '活动整条脊柱，缓解久坐后上背僵硬。',
    steps: ['四点跪姿，手在肩正下方，膝在髋正下方', '吸气塌腰、抬头、打开胸口（牛式）', '呼气从尾骨开始逐节拱背、低头（猫式）', '跟随呼吸慢速流动'],
    mistakes: '只动脖子不动胸椎；手肘锁死。' },
  { id: 'doorway', name: '门框胸肌拉伸', source: '周六野', issue: '圆肩', dose: '每侧 30 秒', secs: 60, video: 'https://www.bilibili.com/video/BV1G5411Y7TJ',
    intro: '放松紧张的胸大肌、胸小肌，让肩膀回到正确位置。',
    steps: ['站在门框旁，前臂贴住门框，手肘与肩同高', '同侧脚向前迈一步，身体缓慢前倾', '胸前有拉伸感后停住，保持自然呼吸', '调整手肘高度可以拉伸胸肌不同部位'],
    mistakes: '塌腰往前顶；肩膀向前耸；拉到刺痛。' },
  { id: 'ytw', name: '俯卧 Y-T-W', source: 'Pamela', issue: '驼背', dose: '每个 8 次', secs: 90, video: 'https://www.youtube.com/watch?v=JAuNs5FnAOU',
    intro: '强化上背和肩胛周围的肌肉，帮助挺直上背。',
    steps: ['俯卧，额头下垫毛巾，颈部保持中立', '手臂依次摆成 Y、T、W 形，拇指朝上', '收紧肩胛把手臂抬离地面，停 2 秒', '慢慢放下，换下一个字母'],
    mistakes: '用腰发力把上身抬起；耸肩；抬头。' },
  { id: 'chin-tuck', name: '下巴后缩', source: '周六野', issue: '头前伸', dose: '2 组 × 12 次', secs: 45, video: 'https://www.bilibili.com/video/BV1bW411P79X',
    intro: '改善头前伸（乌龟颈），随时随地都能做。',
    steps: ['坐直或站直，目视前方', '下巴水平向后推，像做出"双下巴"', '后颈有拉长感，停 3 秒', '放松后重复'],
    mistakes: '用低头或仰头代替水平后缩。' },
  { id: 'thoracic-rot', name: '胸椎旋转', source: 'Pamela', issue: '驼背', dose: '每侧 10 次', secs: 60, video: 'https://www.youtube.com/watch?v=-KmREab38sQ',
    intro: '提升胸椎旋转灵活度，打开胸口。',
    steps: ['侧卧，屈髋屈膝 90°，双臂向前伸直合掌', '上方手臂向后画弧打开，眼睛跟随手', '膝盖保持并拢贴地', '呼气打开，吸气还原'],
    mistakes: '膝盖跟着翻；用腰代替胸椎转动。' },
  { id: 'dead-bug', name: '死虫式', source: 'Pamela', issue: '骨盆前倾', dose: '3 组 × 12 次', secs: 90,
    intro: '训练深层核心，帮助控制骨盆位置。',
    steps: ['仰卧，手臂指向天花板，屈髋屈膝 90°', '腰部压实地面', '呼气时对侧手脚缓慢伸远', '回到中间，换另一侧'],
    mistakes: '腰离开地面；速度太快。' },
  { id: 'hip-flexor', name: '跪姿髋屈肌拉伸', source: 'Pamela', issue: '骨盆前倾', dose: '每侧 45 秒', secs: 90, video: 'https://www.youtube.com/watch?v=12pSXygAzwk',
    intro: '拉伸久坐缩短的髋屈肌，改善骨盆前倾。',
    steps: ['单膝跪地，前脚踩地成弓步', '收紧臀部，骨盆微微后卷', '身体略向前移，直到后腿大腿前侧有拉伸感', '保持并自然呼吸'],
    mistakes: '塌腰往前顶，拉伸跑到了腰上。' },
  { id: 'glute-bridge', name: '臀桥', source: '周六野', issue: '骨盆前倾', dose: '3 组 × 15 次', secs: 90,
    intro: '激活臀部，平衡前后侧肌肉力量。',
    steps: ['仰卧屈膝，脚跟靠近臀部', '骨盆微后倾，腰部贴地', '臀部发力抬起，至肩、髋、膝一条线', '顶端停 2 秒，慢慢放下'],
    mistakes: '用腰往上顶；膝盖外翻或内扣。' },
  { id: 'side-er', name: '侧卧肩外旋', source: 'Pamela', issue: '高低肩', dose: '每侧 12 次', secs: 60,
    intro: '强化肩袖外旋肌群，稳定肩关节。',
    steps: ['侧卧，上方手肘贴住身体弯成 90°', '可在腋下夹一个毛巾卷', '前臂向上旋转打开，手肘不离开身体', '慢慢放回'],
    mistakes: '肩膀前扣；身体向后翻转借力。' }
];

function freshState() {
  return {
    v: 1,
    exercises: SEED.map(({ video, ...e }) => ({ ...e, videoUrl: '', videoStart: '', photoIds: [] })),
    planName: '圆肩驼背改善',
    plan: ['wall-angel', 'cat-cow', 'doorway', 'ytw', 'chin-tuck'],
    log: {},
    postures: [],
    settings: {
      days: [true, true, true, true, true, true, false],
      daily: { on: true, time: '20:30' },
      sit: { on: false, interval: 60, start: '09:00', end: '18:00', weekdays: true },
      photo: { on: true, day: 6, time: '10:00' }
    },
    meta: { startedAt: dateKey(new Date()), notified: {} }
  };
}

/* ---------- Helpers ---------- */

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
function dateKey(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function hhmm(d) { return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }
const dayIdx = (d) => (d.getDay() + 6) % 7; // Monday = 0
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
function fmtSecs(s) { s = Math.max(0, Math.round(s)); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; }
function fmtDuration(s) { const m = Math.floor(s / 60), r = s % 60; return m ? (r ? `${m} 分 ${r} 秒` : `${m} 分钟`) : `${r} 秒`; }
function fmtDateCN(d) { return `${d.getMonth() + 1}月${d.getDate()}日 · 周${WEEK[dayIdx(d)]}`; }
function parseStart(v) {
  v = String(v || '').trim();
  if (!v) return 0;
  if (/^\d+$/.test(v)) return +v;
  const parts = v.split(/[:：]/).map(Number);
  if (parts.some(isNaN)) return 0;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}
function isHttpUrl(u) { try { const x = new URL(u); return x.protocol === 'https:' || x.protocol === 'http:'; } catch { return false; } }

/* ---------- State ---------- */

let S = load();
function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      const base = freshState();
      return fillSeedVideos({ ...base, ...s, settings: { ...base.settings, ...s.settings }, meta: { ...base.meta, ...s.meta } });
    }
  } catch (e) { console.warn('load failed', e); }
  return fillSeedVideos(freshState());
}
// Fill suggested videos once, only where the user hasn't linked one, so a link
// the user clears later stays cleared.
function fillSeedVideos(st) {
  if (st.meta.seedVideos) return st;
  for (const seed of SEED) {
    const x = st.exercises.find((e) => e.id === seed.id);
    if (!seed.video || !x || x.videoUrl) continue;
    Object.assign(x, { videoUrl: seed.video, videoStart: '', videoAuto: true, source: seed.source });
  }
  st.meta.seedVideos = 1;
  return st;
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); }
  catch (e) { toast('保存失败：存储空间可能已满'); }
}

const ex = (id) => S.exercises.find((e) => e.id === id);
const planExercises = () => S.plan.map(ex).filter(Boolean);
const planSecs = () => planExercises().reduce((a, e) => a + (+e.secs || 0), 0);
function entry(k) { return S.log[k] || { done: [], checkedIn: false }; }
function setEntry(k, e) { S.log[k] = e; save(); }
const isPracticeDay = (d) => !!S.settings.days[dayIdx(d)];

function streak() {
  const today = dateKey(new Date());
  const d = new Date();
  let n = 0;
  for (let i = 0; i < 1000; i++) {
    const k = dateKey(d);
    const e = S.log[k];
    if (e && e.checkedIn) n++;
    else if (k < S.meta.startedAt) break;
    else if (isPracticeDay(d) && k !== today) break;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/* ---------- Photo storage (IndexedDB) ---------- */

const photoDB = (() => {
  let dbp;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    const r = indexedDB.open('posture-photos', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('photos');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  }));
  const run = (mode, fn) => open().then((db) => new Promise((res, rej) => {
    const t = db.transaction('photos', mode);
    const req = fn(t.objectStore('photos'));
    t.oncomplete = () => res(req.result);
    t.onerror = () => rej(t.error);
  }));
  return {
    put: (k, v) => run('readwrite', (s) => s.put(v, k)),
    get: (k) => run('readonly', (s) => s.get(k)),
    del: (k) => run('readwrite', (s) => s.delete(k))
  };
})();
const photoUrls = new Map();
async function photoUrl(id) {
  if (photoUrls.has(id)) return photoUrls.get(id);
  const blob = await photoDB.get(id);
  if (!blob) return '';
  const url = URL.createObjectURL(blob);
  photoUrls.set(id, url);
  return url;
}
function hydratePhotos(root = document) {
  root.querySelectorAll('img[data-photo]:not([src])').forEach(async (img) => {
    const url = await photoUrl(img.dataset.photo).catch(() => '');
    if (url) img.src = url;
  });
}
// Downscale to keep storage small.
function compressImage(file, max = 1000) {
  return new Promise((res, rej) => {
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(src);
      c.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), 'image/jpeg', 0.82);
    };
    img.onerror = () => { URL.revokeObjectURL(src); rej(new Error('无法读取图片')); };
    img.src = src;
  });
}
async function savePhoto(file) {
  const blob = await compressImage(file);
  const id = 'p' + uid();
  await photoDB.put(id, blob);
  return id;
}
async function deletePhoto(id) {
  await photoDB.del(id).catch(() => {});
  const url = photoUrls.get(id);
  if (url) { URL.revokeObjectURL(url); photoUrls.delete(id); }
}

/* ---------- Step illustrations ---------- */

// Hand-drawn key poses for the built-in moves, shown instead of the video player
// (B站's often won't load inside the app). Original drawings, not the creators' photos.
const arrow = (x1, y1, x2, y2) => {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 7;
  const p = (d) => `${(x2 - h * Math.cos(a + d)).toFixed(1)} ${(y2 - h * Math.sin(a + d)).toFixed(1)}`;
  return `<path class="a" d="M${x1} ${y1}L${x2} ${y2}M${p(0.5)}L${x2} ${y2}L${p(-0.5)}"/>`;
};
const head = (x, y, r = 9) => `<circle class="h" cx="${x}" cy="${y}" r="${r}"/>`;
const ground = (y) => `<path class="g" d="M8 ${y}H152"/>`;
const FIGS = {
  'wall-angel': [
    ['背贴墙，手臂成 W', '<rect class="p" x="28" y="6" width="104" height="104" rx="3"/>' + ground(110) + '<path d="M80 36V76M80 76L70 110M80 76L90 110M60 46H100M60 46L46 62L40 38M100 46L114 62L120 38"/>' + head(80, 25, 10)],
    ['沿墙上滑成 Y，再回到 W', '<rect class="p" x="28" y="6" width="104" height="104" rx="3"/>' + ground(110) + '<path d="M80 36V76M80 76L70 110M80 76L90 110M60 46H100M60 46L40 12M100 46L120 12"/>' + head(80, 25, 10) + arrow(20, 56, 20, 30) + arrow(140, 56, 140, 30)]
  ],
  ytw: [
    ['Y：手臂抬离地面', '<path d="M80 34V82M80 82L72 114M80 82L88 114M66 40H94M66 40L44 8M94 40L116 8"/>' + head(80, 22)],
    ['T：收紧肩胛', '<path d="M80 34V82M80 82L72 114M80 82L88 114M66 40H94M66 40H30M94 40H130"/>' + head(80, 22)],
    ['W：手肘往后夹', '<path d="M80 34V82M80 82L72 114M80 82L88 114M66 40H94M66 40L46 58L40 34M94 40L114 58L120 34"/>' + head(80, 22)]
  ],
  'thoracic-rot': [
    ['侧卧屈膝，双臂向前合掌', ground(104) + '<path d="M34 96H86M86 96L100 72L126 80M42 94L62 62"/>' + head(22, 90)],
    ['上方手臂向后打开，眼看手', ground(104) + '<path d="M34 96H86M86 96L100 72L126 80M42 94L62 62M42 94L18 66"/><path class="a" d="M62 52Q42 34 24 52"/>' + arrow(30, 46, 23, 54) + head(22, 90)]
  ],
  'dead-bug': [
    ['仰卧，手指天，屈髋屈膝 90°', ground(104) + '<path d="M34 98H80M44 98V62M80 98V70H108"/>' + head(22, 92)],
    ['对侧手脚慢慢伸远，腰贴地', ground(104) + '<path d="M34 98H80M44 98V62M44 96L22 68M80 98V70H108M80 98L136 88"/>' + head(22, 92) + arrow(116, 80, 134, 77)]
  ],
  'hip-flexor': [
    ['单膝跪地，收紧臀部', ground(106) + '<path d="M24 106H52L64 72V36M64 72L98 74L100 106M64 42L72 58L66 70"/>' + head(64, 24, 10)],
    ['身体前移，后腿前侧有拉伸感', ground(106) + '<path d="M24 106H52L76 76V40M76 76L102 78L104 106M76 46L84 62L78 74"/>' + head(76, 28, 10) + arrow(90, 56, 110, 56)]
  ],
  'side-er': [
    ['侧卧，手肘贴身弯成 90°', ground(106) + '<path d="M32 96H92L112 84L136 98M38 82H66L72 100"/>' + head(22, 90)],
    ['前臂向上打开，手肘不离身体', ground(106) + '<path d="M32 96H92L112 84L136 98M38 82H66L70 52"/><path class="a" d="M84 92Q92 72 82 58"/>' + arrow(86, 64, 82, 57) + head(22, 90)]
  ],
  'cat-cow': [
    ['吸气 · 塌腰抬头（牛式）', ground(102) + '<path d="M50 64Q85 80 120 64M120 64V102M50 64V102H20M120 64L129 54"/>' + head(137, 46) + arrow(85, 84, 85, 96)],
    ['呼气 · 拱背低头（猫式）', ground(102) + '<path d="M50 64Q85 36 120 64M120 64V102M50 64V102H20M120 64L127 72"/>' + head(133, 80) + arrow(85, 40, 85, 26)]
  ],
  doorway: [
    ['前臂贴门框，肘与肩同高', ground(110) + '<rect class="p" x="118" y="8" width="10" height="102" rx="2"/><path d="M70 38V74M70 74L60 110M70 74L80 110M70 44L54 72M70 44H115V14"/>' + head(70, 26, 10)],
    ['迈一步前倾，胸前有拉伸感', ground(110) + '<rect class="p" x="54" y="8" width="10" height="102" rx="2"/><path d="M62 74L78 40M62 74L40 110M62 74L80 90L90 110M77 43L64 44V16"/>' + head(84, 27, 10) + arrow(96, 56, 116, 56)]
  ],
  'chin-tuck': [
    ['坐直，目视前方', '<path class="g" stroke-dasharray="4 5" d="M60 8V112"/><path d="M60 112V76L78 56M40 112Q40 84 60 82"/><circle class="h" cx="88" cy="42" r="16"/><path class="h" d="M103 38L110 44L103 48Z"/>'],
    ['下巴水平后推，停 3 秒', '<path class="g" stroke-dasharray="4 5" d="M60 8V112"/><path d="M60 112V76L62 54M40 112Q40 84 60 82"/><circle class="h" cx="64" cy="38" r="16"/><path class="h" d="M79 34L86 40L79 44Z"/>' + arrow(108, 58, 88, 58)]
  ],
  'glute-bridge': [
    ['仰卧屈膝，腰贴地', ground(104) + '<path d="M34 98H82L110 70L118 102"/>' + head(22, 92)],
    ['臀部发力抬起，肩髋膝一条线', ground(104) + '<path d="M34 98L76 74L112 54L118 102"/>' + head(22, 92) + arrow(76, 102, 76, 86)]
  ]
};
const figSvg = (body) => `<svg viewBox="0 0 160 120" aria-hidden="true">${body}</svg>`;
function figsBlock(x) {
  return `<div class="figs" style="grid-template-columns:repeat(${FIGS[x.id].length},1fr)">${FIGS[x.id].map(([cap, body], i) => `<figure class="fig">${figSvg(body)}<figcaption><b>${i + 1}</b>${esc(cap)}</figcaption></figure>`).join('')}</div>`;
}

/* ---------- Video embeds ---------- */

function embedUrl(url, start) {
  if (!isHttpUrl(url)) return null;
  const u = new URL(url);
  let t = parseStart(start) || parseStart((u.searchParams.get('t') || '').replace(/s$/, ''));
  const host = u.hostname.replace(/^www\.|^m\./, '');
  let id = null;
  if (host === 'youtu.be') id = u.pathname.slice(1);
  else if (host.endsWith('youtube.com')) id = u.searchParams.get('v') || (u.pathname.match(/\/(shorts|embed|live)\/([\w-]+)/) || [])[2];
  // Privacy-enhanced mode: never load youtube.com itself.
  if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?playsinline=1&rel=0${t ? `&start=${t}` : ''}`;
  return null;
}
// Link for opening outside the app; YouTube goes to the nocookie player, not youtube.com.
// B站's embedded player often fails to load in the app, so B站 links always open outside.
function outsideUrl(x) {
  const emb = embedUrl(x.videoUrl, x.videoStart);
  if (emb) return emb;
  const t = parseStart(x.videoStart);
  if (t && /bilibili\.com/.test(x.videoUrl)) { const u = new URL(x.videoUrl); u.searchParams.set('t', t); return u.href; }
  return x.videoUrl;
}
function mediaBlock(x, opts = {}) {
  if (x.photoIds.length && opts.preferPhoto) return `<div class="media-ph" style="padding:0"><img data-photo="${esc(x.photoIds[0])}" alt="${esc(x.name)} 动作照片" style="width:100%;height:100%;object-fit:contain"></div>`;
  if (FIGS[x.id]) return figsBlock(x);
  const emb = embedUrl(x.videoUrl, x.videoStart);
  if (emb) return `<iframe src="${esc(emb)}" title="${esc(x.name)} 视频" allow="encrypted-media; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  if (isHttpUrl(x.videoUrl)) {
    return `<div class="media-ph">${I.video}<span>这个链接不能在 App 内播放</span><a class="btn light" href="${esc(outsideUrl(x))}" target="_blank" rel="noopener">打开视频${x.videoStart ? `（从 ${esc(x.videoStart)} 开始）` : ''}</a></div>`;
  }
  return `<div class="media-ph">${I.video}<span>还没有视频<br>粘贴你收藏的 ${esc(x.source)} 视频链接</span>${opts.noEdit ? '' : `<button class="btn light" data-act="edit-ex" data-id="${esc(x.id)}">添加视频链接</button>`}</div>`;
}

/* ---------- Icons ---------- */

const I = {
  flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true" style="fill:currentColor;stroke:none"><polygon points="7 4 19 12 7 20"/></svg>',
  playLine: '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="7 4 19 12 7 20"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="5 12 10 17 19 7"/></svg>',
  bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.4-4.4"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  video: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><polygon points="10 9 15 12 10 15"/></svg>',
  skipPrev: '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="19 20 9 12 19 4"/><path d="M5 19V5"/></svg>',
  skipNext: '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="5 4 15 12 5 20"/><path d="M19 5v14"/></svg>',
  camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/></svg>',
  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>'
};
const tagClass = (s) => (s === 'Pamela' ? 'pam' : s === '周六野' ? 'zly' : 'oth');
const tag = (s) => `<span class="tag ${tagClass(s)}">${esc(s)}</span>`;
function thumbHtml(x) {
  if (x.photoIds && x.photoIds.length) return `<img data-photo="${esc(x.photoIds[0])}" alt="">`;
  return FIGS[x.id] ? `<span class="fig-thumb">${figSvg(FIGS[x.id][0][1])}</span>` : I.playLine;
}

/* ---------- UI state ---------- */

const ui = {
  tab: 'today',
  libSource: '全部', libIssue: '全部', libQuery: '',
  calMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  overlay: null, // { type, ... }
  player: null
};

/* ---------- Views ---------- */

function viewToday() {
  const now = new Date();
  const k = dateKey(now);
  const e = entry(k);
  const plan = planExercises();
  const total = plan.length;
  const done = plan.filter((x) => e.done.includes(x.id)).length;
  const all = total > 0 && done === total;
  const st = streak();
  return `
  <header class="top">
    <div><div class="top-sub">${fmtDateCN(now)}</div><h1>今天也站直一点</h1></div>
    <div class="streak">${I.flame}连续 ${st} 天</div>
  </header>
  ${!isPracticeDay(now) && !e.checkedIn ? '<div class="note">今天是休息日，不练也不会断签；想练的话照常打卡。</div>' : ''}
  <section class="plan-card" aria-label="今日进度">
    <div class="row between">
      <div><div class="pc-sub">当前计划</div><div class="pc-title">${esc(S.planName)}</div></div>
      <div class="pc-count">${done}<small>/${total}</small></div>
    </div>
    <div class="bar"><i style="width:${total ? (done / total) * 100 : 0}%"></i></div>
    <div class="pc-meta">约 ${Math.max(1, Math.round(planSecs() / 60))} 分钟 · ${total} 个动作</div>
  </section>
  <div class="row between"><h2>今日动作</h2><button class="link" data-act="tab" data-tab="library">调整计划</button></div>
  ${total ? `<div class="list">${plan.map((x) => moveRow(x, e.done.includes(x.id))).join('')}</div>`
          : '<div class="empty">计划里还没有动作。去「动作库」打开动作，点「加入计划」。</div>'}
  <button class="strip" data-act="tab" data-tab="reminders">${I.bell}<span>${esc(reminderSummary())}</span><b>设置</b></button>
  ${e.checkedIn
    ? `<div class="done-banner">今日已打卡 · 连续 ${st} 天，明天见<button class="link sm" data-act="undo-checkin">撤销</button></div>`
    : `<div class="row">
        <button class="btn dark grow" data-act="play-plan" ${total ? '' : 'disabled'}>${I.play}开始跟练</button>
        <button class="btn ${all ? 'primary' : 'outline'} grow" data-act="checkin">${all ? '打卡' : `还差 ${total - done} 个`}</button>
      </div>`}
  `;
}
function moveRow(x, d) {
  return `<div class="move ${d ? 'is-done' : ''}">
    <button class="thumb" data-act="detail" data-id="${esc(x.id)}" aria-label="查看${esc(x.name)}">${thumbHtml(x)}</button>
    <button class="move-main" data-act="detail" data-id="${esc(x.id)}">
      <span class="move-name">${esc(x.name)}</span>
      <span class="move-meta">${tag(x.source)}<span>${esc(x.dose)}</span></span>
    </button>
    <button class="check" data-act="toggle-done" data-id="${esc(x.id)}" aria-pressed="${d}" aria-label="${d ? '取消完成' : '标记完成'}：${esc(x.name)}">${d ? I.check : ''}</button>
  </div>`;
}
function reminderSummary() {
  const s = S.settings;
  const parts = [];
  if (s.daily.on) parts.push(`${s.daily.time} 提醒打卡`);
  if (s.sit.on) parts.push(`久坐每 ${s.sit.interval} 分钟提醒`);
  return parts.length ? parts.join(' · ') : '提醒已关闭';
}

function viewLibrary() {
  return `
  <header class="top"><h1>动作库</h1><button class="btn dark small" data-act="new-ex">${I.plus}添加</button></header>
  <label class="search">${I.search}<span class="sr">搜索动作</span><input id="libq" type="search" placeholder="搜索动作名称" value="${esc(ui.libQuery)}" autocomplete="off"></label>
  <div class="seg" role="group" aria-label="来源">${['全部', ...SOURCES].map((s) => `<button data-act="lib-src" data-v="${esc(s)}" class="${ui.libSource === s ? 'on' : ''}" aria-pressed="${ui.libSource === s}">${esc(s)}</button>`).join('')}</div>
  <div class="chips" role="group" aria-label="改善部位">${['全部', ...ISSUES].map((s) => `<button class="chip ${ui.libIssue === s ? 'on' : ''}" data-act="lib-issue" data-v="${esc(s)}" aria-pressed="${ui.libIssue === s}">${esc(s)}</button>`).join('')}</div>
  <div id="libGrid">${libGrid()}</div>`;
}
function libGrid() {
  const q = ui.libQuery.trim().toLowerCase();
  const items = S.exercises.filter((x) =>
    (ui.libSource === '全部' || x.source === ui.libSource) &&
    (ui.libIssue === '全部' || x.issue === ui.libIssue) &&
    (!q || x.name.toLowerCase().includes(q)));
  if (!items.length) return '<div class="empty">没有符合条件的动作</div>';
  return `<p class="muted sm" style="margin-bottom:10px">${items.length} 个动作</p>
  <div class="grid2">${items.map((x) => `
    <button class="ex-card" data-act="detail" data-id="${esc(x.id)}">
      <div class="ex-media">${thumbHtml(x)}${tag(x.source)}${S.plan.includes(x.id) ? '<span class="in-plan">计划中</span>' : ''}</div>
      <div class="ex-info"><b>${esc(x.name)}</b><span>${esc(x.issue)} · ${esc(x.dose)}</span></div>
    </button>`).join('')}</div>`;
}

function viewCalendar() {
  const m = ui.calMonth;
  const y = m.getFullYear(), mo = m.getMonth();
  const today = dateKey(new Date());
  const lead = dayIdx(new Date(y, mo, 1));
  const days = new Date(y, mo + 1, 0).getDate();
  let cells = '';
  for (let i = 0; i < lead; i++) cells += '<div class="cal-d blank"></div>';
  let monthCount = 0;
  for (let d = 1; d <= days; d++) {
    const k = dateKey(new Date(y, mo, d));
    const e = S.log[k];
    let cls = e && e.checkedIn ? 'full' : e && e.done && e.done.length ? 'part' : '';
    if (e && e.checkedIn) monthCount++;
    if (k === today) cls += ' today';
    if (k > today) cls += ' future';
    const label = `${mo + 1}月${d}日${e && e.checkedIn ? '，已打卡' : e && e.done && e.done.length ? '，完成部分' : ''}`;
    cells += `<div class="cal-d ${cls}" aria-label="${label}">${d}</div>`;
  }
  const totalSecs = Object.values(S.log).reduce((a, e) => a + (e.secs || 0), 0);
  const ps = [...S.postures].sort((a, b) => (a.date < b.date ? -1 : 1));
  const first = ps[0], last = ps.length > 1 ? ps[ps.length - 1] : null;
  return `
  <header class="top"><h1>打卡记录</h1></header>
  <div class="stats">
    <div class="stat"><span>连续打卡</span><b class="warm">${streak()} 天</b></div>
    <div class="stat"><span>${mo + 1} 月打卡</span><b>${monthCount} 天</b></div>
    <div class="stat"><span>累计跟练</span><b>${totalSecs >= 3600 ? (totalSecs / 3600).toFixed(1) + ' 时' : Math.round(totalSecs / 60) + ' 分'}</b></div>
  </div>
  <section class="panel" aria-label="打卡日历">
    <div class="row between">
      <button class="icon-btn" data-act="cal-prev" aria-label="上个月">${I.back}</button>
      <b>${y} 年 ${mo + 1} 月</b>
      <button class="icon-btn" data-act="cal-next" aria-label="下个月">${I.next}</button>
    </div>
    <div class="cal">${WEEK.map((w) => `<div class="cal-h">${w}</div>`).join('')}${cells}</div>
    <div class="legend"><span><i style="background:var(--accent)"></i>已打卡</span><span><i style="background:var(--accent-mid)"></i>完成部分</span></div>
  </section>
  <section class="stack">
    <div class="row between">
      <h2>体态对比</h2>
      <label class="link" style="cursor:pointer">拍侧面照<input type="file" accept="image/*" capture="environment" data-upload="posture" class="sr"></label>
    </div>
    ${ps.length ? `
      <div class="photos">
        ${postureCard(first, '第一张')}
        ${last ? postureCard(last, '最新') : '<div class="photo"><div class="photo-img">下周再拍一张来对比</div></div>'}
      </div>
      ${ps.length > 2 ? `<div class="thumbs">${ps.map((p) => `<button data-act="view-posture" data-id="${esc(p.id)}" aria-label="查看 ${esc(p.date)} 的照片"><img data-photo="${esc(p.id)}" alt=""></button>`).join('')}</div>` : ''}`
      : '<div class="empty">每周拍一张同角度的全身侧面照：站直放松，手机放在髋部高度。虚线可以帮你看耳朵、肩膀、髋部是否在一条线上。</div>'}
  </section>`;
}
function postureCard(p, label) {
  return `<button class="photo" data-act="view-posture" data-id="${esc(p.id)}">
    <div class="photo-img"><img data-photo="${esc(p.id)}" alt="${esc(p.date)} 侧面照"><i class="guide"></i></div>
    <span>${label} · ${esc(p.date)}</span></button>`;
}

function viewReminders() {
  const s = S.settings;
  const perm = 'Notification' in window ? Notification.permission : 'unsupported';
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let permBlock;
  if (perm === 'unsupported') {
    permBlock = ios && !standalone
      ? '<div class="note warn">iPhone 上要先把 App 加到主屏幕：在 Safari 点「分享」→「添加到主屏幕」，再从主屏幕图标打开，就能开启通知。</div>'
      : '<div class="note warn">这个浏览器不支持网页通知。可以用下面的「加入系统日历」。</div>';
  } else if (perm === 'granted') {
    permBlock = `<div class="row between note"><span>通知已开启</span><button class="link sm" data-act="test-notify">发一条测试</button></div>`;
  } else if (perm === 'denied') {
    permBlock = '<div class="note warn">通知被拒绝了。需要在系统设置里允许这个 App 发送通知。</div>';
  } else {
    permBlock = `<button class="btn primary" data-act="ask-notify">${I.bell}开启通知</button>`;
  }
  const toggle = (path, on, label) => `<button class="toggle" role="switch" aria-checked="${on}" aria-label="${label}" data-act="toggle-setting" data-path="${path}"></button>`;
  return `
  <header class="top"><h1>提醒</h1></header>
  ${permBlock}
  <section class="set-card">
    <b>练习日</b>
    <div class="days" role="group" aria-label="练习日">${WEEK.map((w, i) => `<button data-act="toggle-day" data-i="${i}" aria-pressed="${s.days[i]}" aria-label="周${w}">${w}</button>`).join('')}</div>
    <span class="muted sm">没选中的是休息日，休息日不打卡也不会断签。</span>
  </section>
  <section class="set-card">
    <div class="set-head"><div><b>每日打卡提醒</b><span>练习日到点还没打卡就提醒你</span></div>${toggle('daily.on', s.daily.on, '每日打卡提醒')}</div>
    <label class="set-row ${s.daily.on ? '' : 'off'}"><span>提醒时间</span><input type="time" data-set="daily.time" value="${esc(s.daily.time)}"></label>
  </section>
  <section class="set-card">
    <div class="set-head"><div><b>久坐提醒</b><span>工作时段内提醒起身做一个小动作</span></div>${toggle('sit.on', s.sit.on, '久坐提醒')}</div>
    <label class="set-row ${s.sit.on ? '' : 'off'}"><span>间隔</span>
      <select data-set="sit.interval">${[30, 45, 60, 90, 120].map((n) => `<option value="${n}" ${+s.sit.interval === n ? 'selected' : ''}>${n} 分钟</option>`).join('')}</select></label>
    <div class="set-row ${s.sit.on ? '' : 'off'}"><span>时段</span>
      <span class="row" style="gap:6px"><input type="time" aria-label="开始时间" data-set="sit.start" value="${esc(s.sit.start)}">–<input type="time" aria-label="结束时间" data-set="sit.end" value="${esc(s.sit.end)}"></span></div>
    <div class="set-row ${s.sit.on ? '' : 'off'}"><span>只在工作日（周一到周五）</span>${toggle('sit.weekdays', s.sit.weekdays, '只在工作日')}</div>
  </section>
  <section class="set-card">
    <div class="set-head"><div><b>每周体态照</b><span>提醒拍同角度侧面照用于对比</span></div>${toggle('photo.on', s.photo.on, '每周体态照提醒')}</div>
    <div class="set-row ${s.photo.on ? '' : 'off'}"><span>时间</span>
      <span class="row" style="gap:6px"><select aria-label="星期" data-set="photo.day">${WEEK.map((w, i) => `<option value="${i}" ${+s.photo.day === i ? 'selected' : ''}>周${w}</option>`).join('')}</select><input type="time" aria-label="时间" data-set="photo.time" value="${esc(s.photo.time)}"></span></div>
  </section>
  <section class="set-card">
    <b>加入系统日历（App 关着也会响）</b>
    <span class="muted sm">网页 App 在后台被系统关掉后就发不出通知。把提醒加到手机日历里，到点一定会响，点开日历事件里的链接就能回到 App。</span>
    <div class="btn-col">
      <button class="btn outline" data-act="ics-daily" ${s.daily.on ? '' : 'disabled'}>每日打卡提醒 → 日历</button>
      <button class="btn outline" data-act="ics-photo" ${s.photo.on ? '' : 'disabled'}>每周体态照提醒 → 日历</button>
    </div>
  </section>
  <section class="set-card">
    <b>数据备份</b>
    <span class="muted sm">打卡记录只保存在这台手机的浏览器里。换手机或清理浏览器前先导出备份（备份不包含照片）。</span>
    <div class="row">
      <button class="btn outline grow" data-act="export">导出备份</button>
      <label class="btn outline grow" style="cursor:pointer">导入备份<input type="file" accept="application/json,.json" data-upload="backup" class="sr"></label>
    </div>
  </section>`;
}

/* ---------- Overlays ---------- */

function ovDetail(x) {
  const inPlan = S.plan.includes(x.id);
  const emb = embedUrl(x.videoUrl, x.videoStart);
  return `<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(x.name)}">
    <div class="sheet-scroll">
      <div class="media">${mediaBlock(x, { preferPhoto: true })}<button class="back" data-act="close" aria-label="返回">${I.back}</button></div>
      <div class="sheet-body">
        <div class="stack" style="gap:8px">
          <div class="row" style="gap:6px;flex-wrap:wrap">${tag(x.source)}<span class="tag issue">${esc(x.issue)}</span>${inPlan ? '<span class="tag issue">计划中</span>' : ''}</div>
          <h1>${esc(x.name)}</h1>
          ${x.intro ? `<p class="intro">${esc(x.intro)}</p>` : ''}
          ${isHttpUrl(x.videoUrl) ? `<a class="link sm" href="${esc(outsideUrl(x))}" target="_blank" rel="noopener">${/bilibili\.com|b23\.tv/.test(x.videoUrl) ? '在 B站 看完整视频' : FIGS[x.id] ? '看完整视频' : '在 App 外打开视频'}</a>` : ''}
          ${x.videoAuto && embedUrl(x.videoUrl) && !FIGS[x.id] ? '<p class="muted sm">自动填写的推荐视频：这是一整套训练，这个动作不一定在开头。找到位置后可以在「编辑」里填起始时间。</p>' : ''}
        </div>
        <div class="stats">
          <div class="stat"><span>次数</span><b style="font-size:16px">${esc(x.dose || '—')}</b></div>
          <div class="stat"><span>跟练时长</span><b style="font-size:16px">${fmtDuration(+x.secs || 0)}</b></div>
          <div class="stat"><span>视频起点</span><b style="font-size:16px">${esc(x.videoStart || '—')}</b></div>
        </div>
        ${x.photoIds.length ? `<div class="stack"><h2>动作照片</h2><div class="thumbs">${x.photoIds.map((id) => `<button data-act="view-ex-photo" data-id="${esc(x.id)}" data-pid="${esc(id)}" aria-label="查看照片"><img data-photo="${esc(id)}" alt=""></button>`).join('')}</div></div>` : ''}
        ${x.steps.length ? `<div class="stack"><h2>动作要点</h2><ol class="steps">${x.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div>` : ''}
        ${x.mistakes ? `<div class="mistakes"><b>常见错误</b><span>${esc(x.mistakes)}</span></div>` : ''}
        <div class="ex-actions">
          <button class="btn outline" data-act="toggle-plan" data-id="${esc(x.id)}">${inPlan ? '移出计划' : '加入计划'}</button>
          <button class="btn outline" data-act="edit-ex" data-id="${esc(x.id)}">编辑</button>
        </div>
      </div>
    </div>
    <div class="sheet-foot"><button class="btn dark grow" data-act="play-one" data-id="${esc(x.id)}">${I.play}跟练这个动作</button></div>
  </div>`;
}

function ovEdit(d) {
  const isNew = !ex(d.id);
  const opt = (list, v) => list.map((s) => `<option ${s === v ? 'selected' : ''}>${esc(s)}</option>`).join('');
  return `<form class="sheet" data-form="ex" role="dialog" aria-modal="true" aria-label="${isNew ? '添加动作' : '编辑动作'}" novalidate>
    <div class="sheet-bar">
      <button type="button" class="icon-btn" data-act="close-edit" aria-label="取消">${I.close}</button>
      <h2>${isNew ? '添加动作' : '编辑动作'}</h2>
      <button type="submit" class="link" style="padding:10px 12px">保存</button>
    </div>
    <div class="sheet-scroll"><div class="sheet-body form">
      <label class="field"><span>动作名称</span><input name="name" required value="${esc(d.name)}" placeholder="例如：靠墙天使"></label>
      <div class="two">
        <label class="field"><span>来源</span><select name="source">${opt(SOURCES, d.source)}</select></label>
        <label class="field"><span>改善部位</span><select name="issue">${opt(ISSUES, d.issue)}</select></label>
      </div>
      <div class="two">
        <label class="field"><span>次数 / 组数</span><input name="dose" value="${esc(d.dose)}" placeholder="3 组 × 10 次"></label>
        <label class="field"><span>跟练时长（秒）</span><input name="secs" type="number" inputmode="numeric" min="10" max="1800" value="${esc(d.secs)}"></label>
      </div>
      <label class="field"><span>视频链接</span><input name="videoUrl" type="url" inputmode="url" value="${esc(d.videoUrl)}" placeholder="B站 或 YouTube 链接"><small>有示意图的动作会显示示意图，视频在 App 外打开；其他动作的 YouTube 链接可在 App 内播放。</small></label>
      <label class="field"><span>从第几分几秒开始</span><input name="videoStart" value="${esc(d.videoStart)}" placeholder="例如 2:15"></label>
      <div class="field"><span>动作照片</span>
        <div class="thumbs">
          ${d.photoIds.map((id) => `<button type="button" data-act="rm-draft-photo" data-pid="${esc(id)}" aria-label="删除这张照片"><img data-photo="${esc(id)}" alt=""></button>`).join('')}
          <label class="add-photo" aria-label="添加照片">${I.camera}<input type="file" accept="image/*" data-upload="ex-photo" class="sr" multiple></label>
        </div>
        <small>可以放分步截图或自己拍的照片；点照片可删除。</small>
      </div>
      <label class="field"><span>简介</span><textarea name="intro" placeholder="这个动作主要改善什么">${esc(d.intro)}</textarea></label>
      <label class="field"><span>动作要点（一行一条）</span><textarea name="steps" style="min-height:120px">${esc(d.steps.join('\n'))}</textarea></label>
      <label class="field"><span>常见错误</span><textarea name="mistakes">${esc(d.mistakes)}</textarea></label>
      ${isNew ? '' : `<button type="button" class="btn danger" data-act="delete-ex" data-id="${esc(d.id)}">${I.trash}删除这个动作</button>`}
    </div></div>
  </form>`;
}

function ovPlayer() {
  const p = ui.player;
  if (p.finished) {
    const k = dateKey(new Date());
    const e = entry(k);
    const plan = planExercises();
    const all = plan.length && plan.every((x) => e.done.includes(x.id));
    return `<div class="sheet player" role="dialog" aria-modal="true" aria-label="跟练完成">
      <div class="sheet-bar"><button class="icon-btn" data-act="close-player" aria-label="关闭">${I.close}</button><span class="grow"></span></div>
      <div class="p-finish">
        <h1>练完了</h1>
        <p class="p-sub">本次跟练 ${fmtDuration(p.elapsed)}</p>
        ${e.checkedIn ? '<p class="p-sub">今天已经打过卡了</p>'
          : all ? `<button class="btn primary" data-act="checkin-close">打卡</button>`
          : `<p class="p-sub">今日计划还剩 ${plan.filter((x) => !e.done.includes(x.id)).length} 个动作没完成</p>`}
        <button class="btn light" data-act="close-player">返回</button>
      </div>
    </div>`;
  }
  const x = ex(p.ids[p.idx]);
  const nx = ex(p.ids[p.idx + 1]);
  return `<div class="sheet player" role="dialog" aria-modal="true" aria-label="跟练">
    <div class="sheet-bar">
      <button class="icon-btn" data-act="close-player" aria-label="结束跟练">${I.close}</button>
      <h2 class="p-sub" style="font-weight:500">第 ${p.idx + 1} / ${p.ids.length} 个动作</h2>
      <span style="width:44px"></span>
    </div>
    <div class="p-progress" aria-hidden="true">${p.ids.map((_, i) => `<i class="${i < p.idx ? 'done' : i === p.idx ? 'cur' : ''}"></i>`).join('')}</div>
    <div class="media">${mediaBlock(x, { preferPhoto: true, noEdit: true })}</div>
    <div class="p-info">
      <span class="p-tag">${esc(x.source)}</span>
      <h1>${esc(x.name)}</h1>
      <div class="clock" id="clock" role="timer" aria-live="off">${fmtSecs(p.left)}</div>
      <span class="p-sub">${esc(x.dose)} · 下一个：${nx ? esc(nx.name) : '完成'}</span>
    </div>
    <div class="p-controls">
      <button data-act="p-prev" aria-label="上一个动作" ${p.idx === 0 ? 'disabled' : ''}>${I.skipPrev}</button>
      <button class="main" data-act="p-toggle" id="pToggle" aria-label="${p.paused ? '继续' : '暂停'}">${p.paused ? I.play : '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>'}</button>
      <button data-act="p-next" aria-label="完成这个动作，下一个">${I.skipNext}</button>
    </div>
  </div>`;
}

function ovPhoto(pid, label, deleteAct, extra = '') {
  return `<div class="sheet viewer" role="dialog" aria-modal="true" aria-label="照片">
    <div class="sheet-bar">
      <button class="icon-btn" data-act="close" aria-label="关闭">${I.close}</button>
      <h2 style="color:#fff;font-weight:500">${esc(label)}</h2>
      ${deleteAct ? `<button class="icon-btn" data-act="${deleteAct}" data-pid="${esc(pid)}" ${extra} aria-label="删除照片">${I.trash}</button>` : '<span style="width:44px"></span>'}
    </div>
    <img data-photo="${esc(pid)}" alt="${esc(label)}">
  </div>`;
}

/* ---------- Rendering ---------- */

const viewEl = $('#view');
const overlayEl = $('#overlay');

function render() {
  const views = { today: viewToday, library: viewLibrary, calendar: viewCalendar, reminders: viewReminders };
  viewEl.innerHTML = views[ui.tab]();
  document.querySelectorAll('#nav button').forEach((b) => {
    if (b.dataset.tab === ui.tab) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  hydratePhotos(viewEl);
}
function renderOverlay() {
  const o = ui.overlay;
  if (!o) { overlayEl.innerHTML = ''; document.body.style.overflow = ''; return; }
  document.body.style.overflow = 'hidden';
  if (o.type === 'detail') overlayEl.innerHTML = ovDetail(ex(o.id));
  else if (o.type === 'edit') overlayEl.innerHTML = ovEdit(o.draft);
  else if (o.type === 'player') overlayEl.innerHTML = ovPlayer();
  else if (o.type === 'posture') {
    const p = S.postures.find((x) => x.id === o.id);
    overlayEl.innerHTML = ovPhoto(p.id, `${p.date} 侧面照`, 'del-posture');
  } else if (o.type === 'ex-photo') overlayEl.innerHTML = ovPhoto(o.pid, ex(o.id).name, null);
  hydratePhotos(overlayEl);
}
function openOverlay(o) { ui.overlay = o; renderOverlay(); }
function closeOverlay() { ui.overlay = o_back(); renderOverlay(); render(); }
// Photo viewers and the editor return to the exercise they came from.
function o_back() {
  const o = ui.overlay;
  if (o && (o.type === 'ex-photo' || (o.type === 'edit' && ex(o.draft.id)))) return { type: 'detail', id: o.type === 'edit' ? o.draft.id : o.id };
  return null;
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Check-in ---------- */

function toggleDone(id, force) {
  const k = dateKey(new Date());
  const e = entry(k);
  const has = e.done.includes(id);
  const want = force ?? !has;
  if (want === has) return;
  const x = ex(id);
  const done = want ? [...e.done, id] : e.done.filter((d) => d !== id);
  setEntry(k, { ...e, done, secs: Math.max(0, (e.secs || 0) + (want ? 1 : -1) * (+x?.secs || 0)) });
}
function checkIn() {
  const k = dateKey(new Date());
  const e = entry(k);
  const plan = planExercises();
  const left = plan.filter((x) => !e.done.includes(x.id)).length;
  if (!plan.length) return toast('先在动作库里把动作加入计划');
  if (left) return toast(`还有 ${left} 个动作没完成`);
  setEntry(k, { ...e, checkedIn: true, at: Date.now() });
  toast(`打卡成功！连续 ${streak()} 天`);
  if (navigator.vibrate) navigator.vibrate(30);
}

/* ---------- Player ---------- */

let tickTimer = null;
let wakeLock = null;
let audioCtx = null;

function beep() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.18].forEach((t) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + t + 0.15);
      o.connect(g).connect(audioCtx.destination);
      o.start(audioCtx.currentTime + t);
      o.stop(audioCtx.currentTime + t + 0.16);
    });
  } catch { /* audio not available */ }
  if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
}
async function startPlayer(ids) {
  ids = ids.filter((id) => ex(id));
  if (!ids.length) return;
  // Unlock audio during the user's tap so the end-of-move beep can play.
  try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume(); } catch {}
  ui.player = { ids, idx: 0, left: +ex(ids[0]).secs || 60, paused: false, finished: false, elapsed: 0 };
  openOverlay({ type: 'player' });
  clearInterval(tickTimer);
  tickTimer = setInterval(tick, 1000);
  try { wakeLock = await navigator.wakeLock?.request('screen'); } catch { wakeLock = null; }
}
function tick() {
  const p = ui.player;
  if (!p || p.paused || p.finished) return;
  p.left -= 1;
  p.elapsed += 1;
  if (p.left <= 0) { beep(); advance(true); return; }
  const c = $('#clock');
  if (c) c.textContent = fmtSecs(p.left);
}
function advance(markDone) {
  const p = ui.player;
  if (markDone) toggleDone(p.ids[p.idx], true);
  if (p.idx + 1 >= p.ids.length) p.finished = true;
  else { p.idx += 1; p.left = +ex(p.ids[p.idx]).secs || 60; }
  renderOverlay();
}
function stopPlayer() {
  clearInterval(tickTimer);
  tickTimer = null;
  ui.player = null;
  try { wakeLock?.release(); } catch {}
  wakeLock = null;
  ui.overlay = null;
  renderOverlay();
  render();
}

/* ---------- Reminders ---------- */

async function notify(title, body, tagName) {
  if (document.visibilityState === 'visible') toast(`${title}：${body}`);
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const opts = { body, tag: tagName, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', data: { url: './' } };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) return reg.showNotification(title, opts);
    new Notification(title, opts);
  } catch (e) { console.warn('notify failed', e); }
}
const sitStartedAt = Date.now();
function checkReminders() {
  const now = new Date();
  const k = dateKey(now);
  const hm = hhmm(now);
  const s = S.settings;
  const n = S.meta.notified;
  if (s.daily.on && isPracticeDay(now) && hm >= s.daily.time && n.daily !== k && !entry(k).checkedIn) {
    n.daily = k; save();
    const left = planExercises().filter((x) => !entry(k).done.includes(x.id)).length;
    notify('该做体态练习了', `今天还有 ${left} 个动作，大约 ${Math.max(1, Math.round(planSecs() / 60))} 分钟`, 'daily');
  }
  const workday = dayIdx(now) < 5;
  if (s.sit.on && (!s.sit.weekdays || workday) && hm >= s.sit.start && hm < s.sit.end) {
    const last = Math.max(sitStartedAt, n.sitAt || 0);
    if (Date.now() - last >= s.sit.interval * 60000) {
      n.sitAt = Date.now(); save();
      const pick = planExercises()[Math.floor(Math.random() * Math.max(1, S.plan.length))];
      notify('坐太久啦', pick ? `起来做一组「${pick.name}」，1 分钟就好` : '起来活动一下肩背', 'sit');
    }
  }
  const weekKey = `${k}-w`;
  if (s.photo.on && dayIdx(now) === +s.photo.day && hm >= s.photo.time && n.photo !== weekKey && !S.postures.some((p) => p.date === k)) {
    n.photo = weekKey; save();
    notify('拍一张体态照', '同样的角度拍一张侧面照，看看这周的变化', 'photo');
  }
}

function icsStamp(d) { return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`; }
function icsEscape(s) { return String(s).replace(/[\\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n'); }
function downloadIcs(name, { summary, description, time, byday }) {
  const [h, m] = time.split(':').map(Number);
  const start = new Date();
  start.setHours(h, m, 0, 0);
  // Start on the next matching weekday so the first occurrence is valid.
  for (let i = 0; i < 8 && !byday.includes(ICS_DAYS[dayIdx(start)]); i++) start.setDate(start.getDate() + 1);
  const appUrl = location.origin + location.pathname;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Posture Checkin//CN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid()}@posture-checkin`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')}`,
    `DTSTART:${icsStamp(start)}`,
    'DURATION:PT15M',
    `RRULE:FREQ=WEEKLY;BYDAY=${byday.join(',')}`,
    `SUMMARY:${icsEscape(summary)}`,
    `DESCRIPTION:${icsEscape(description + '\n' + appUrl)}`,
    `URL:${appUrl}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsEscape(summary)}`, 'TRIGGER:PT0M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'
  ];
  downloadFile(name, lines.join('\r\n'), 'text/calendar;charset=utf-8');
}
function downloadFile(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/* ---------- Events ---------- */

function readDraft(form) {
  const f = new FormData(form);
  const d = ui.overlay.draft;
  Object.assign(d, {
    name: String(f.get('name') || '').trim(),
    source: f.get('source'),
    issue: f.get('issue'),
    dose: String(f.get('dose') || '').trim(),
    secs: Math.min(1800, Math.max(10, parseInt(f.get('secs'), 10) || 60)),
    videoUrl: String(f.get('videoUrl') || '').trim(),
    videoStart: String(f.get('videoStart') || '').trim(),
    intro: String(f.get('intro') || '').trim(),
    steps: String(f.get('steps') || '').split('\n').map((s) => s.trim()).filter(Boolean),
    mistakes: String(f.get('mistakes') || '').trim()
  });
  return d;
}

const actions = {
  tab: (el) => { ui.tab = el.dataset.tab; render(); window.scrollTo(0, 0); },
  'toggle-done': (el) => { toggleDone(el.dataset.id); render(); },
  checkin: () => { checkIn(); render(); },
  'undo-checkin': () => { const k = dateKey(new Date()); setEntry(k, { ...entry(k), checkedIn: false }); render(); },
  'play-plan': () => {
    const e = entry(dateKey(new Date()));
    const todo = S.plan.filter((id) => !e.done.includes(id));
    startPlayer(todo.length ? todo : S.plan);
  },
  'play-one': (el) => startPlayer([el.dataset.id]),
  detail: (el) => openOverlay({ type: 'detail', id: el.dataset.id }),
  close: () => closeOverlay(),
  'toggle-plan': (el) => {
    const id = el.dataset.id;
    S.plan = S.plan.includes(id) ? S.plan.filter((x) => x !== id) : [...S.plan, id];
    save();
    toast(S.plan.includes(id) ? '已加入今日计划' : '已移出计划');
    renderOverlay(); render();
  },
  'new-ex': () => openOverlay({ type: 'edit', draft: { id: 'u' + uid(), name: '', source: ui.libSource !== '全部' ? ui.libSource : 'Pamela', issue: ui.libIssue !== '全部' ? ui.libIssue : '圆肩', dose: '', secs: 60, videoUrl: '', videoStart: '', intro: '', steps: [], mistakes: '', photoIds: [] } }),
  'edit-ex': (el) => { const x = ex(el.dataset.id); openOverlay({ type: 'edit', draft: { ...x, steps: [...x.steps], photoIds: [...x.photoIds] } }); },
  'close-edit': () => {
    // Discard photos added in this unsaved edit.
    const d = ui.overlay.draft;
    const orig = ex(d.id);
    d.photoIds.filter((id) => !orig || !orig.photoIds.includes(id)).forEach(deletePhoto);
    closeOverlay();
  },
  'rm-draft-photo': (el) => {
    const form = el.closest('form');
    const d = readDraft(form);
    d.photoIds = d.photoIds.filter((id) => id !== el.dataset.pid);
    renderOverlay();
  },
  'delete-ex': async (el) => {
    const x = ex(el.dataset.id);
    if (!confirm(`删除「${x.name}」？这个动作的照片也会一起删除。`)) return;
    x.photoIds.forEach(deletePhoto);
    S.exercises = S.exercises.filter((e) => e.id !== x.id);
    S.plan = S.plan.filter((id) => id !== x.id);
    save();
    ui.overlay = null; renderOverlay(); render();
    toast('已删除');
  },
  'view-ex-photo': (el) => openOverlay({ type: 'ex-photo', id: el.dataset.id, pid: el.dataset.pid }),
  'lib-src': (el) => { ui.libSource = el.dataset.v; render(); },
  'lib-issue': (el) => { ui.libIssue = el.dataset.v; render(); },
  'cal-prev': () => { ui.calMonth = new Date(ui.calMonth.getFullYear(), ui.calMonth.getMonth() - 1, 1); render(); },
  'cal-next': () => { ui.calMonth = new Date(ui.calMonth.getFullYear(), ui.calMonth.getMonth() + 1, 1); render(); },
  'view-posture': (el) => openOverlay({ type: 'posture', id: el.dataset.id }),
  'del-posture': async (el) => {
    if (!confirm('删除这张体态照？')) return;
    await deletePhoto(el.dataset.pid);
    S.postures = S.postures.filter((p) => p.id !== el.dataset.pid);
    save();
    closeOverlay();
  },
  'p-toggle': () => { ui.player.paused = !ui.player.paused; renderOverlay(); },
  'p-next': () => advance(true),
  'p-prev': () => { const p = ui.player; if (p.idx > 0) { p.idx -= 1; p.left = +ex(p.ids[p.idx]).secs || 60; renderOverlay(); } },
  'close-player': () => stopPlayer(),
  'checkin-close': () => { checkIn(); stopPlayer(); },
  'toggle-setting': (el) => {
    const [a, b] = el.dataset.path.split('.');
    S.settings[a][b] = !S.settings[a][b];
    save(); render();
    if (b === 'on' && S.settings[a][b] && 'Notification' in window && Notification.permission === 'default') askNotify();
  },
  'toggle-day': (el) => { const i = +el.dataset.i; S.settings.days[i] = !S.settings.days[i]; save(); render(); },
  'ask-notify': () => askNotify(),
  'test-notify': () => notify('体态打卡', '通知正常，到点会这样提醒你', 'test'),
  'ics-daily': () => {
    const byday = ICS_DAYS.filter((_, i) => S.settings.days[i]);
    if (!byday.length) return toast('先选至少一个练习日');
    downloadIcs('体态打卡-每日提醒.ics', { summary: '体态打卡', description: `今天的 ${S.plan.length} 个体态动作，大约 ${Math.max(1, Math.round(planSecs() / 60))} 分钟`, time: S.settings.daily.time, byday });
  },
  'ics-photo': () => downloadIcs('体态打卡-每周体态照.ics', { summary: '拍一张体态照', description: '同样的角度拍一张全身侧面照', time: S.settings.photo.time, byday: [ICS_DAYS[+S.settings.photo.day]] }),
  export: () => downloadFile(`体态打卡备份-${dateKey(new Date())}.json`, JSON.stringify(S, null, 2), 'application/json')
};

async function askNotify() {
  if (!('Notification' in window)) return toast('这个浏览器不支持通知');
  const r = await Notification.requestPermission();
  toast(r === 'granted' ? '通知已开启' : '没有开启通知');
  render();
}

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.act];
  if (fn) { ev.preventDefault(); fn(el); }
});

document.addEventListener('input', (ev) => {
  if (ev.target.id === 'libq') { ui.libQuery = ev.target.value; $('#libGrid').innerHTML = libGrid(); hydratePhotos($('#libGrid')); }
});

document.addEventListener('change', async (ev) => {
  const t = ev.target;
  if (t.dataset.set) {
    const [a, b] = t.dataset.set.split('.');
    const v = t.type === 'time' ? t.value : t.tagName === 'SELECT' ? +t.value : t.value;
    if (t.type === 'time' && !v) return;
    S.settings[a][b] = v;
    if (a === 'daily') delete S.meta.notified.daily; // allow today's reminder at the new time
    save(); render();
    return;
  }
  const kind = t.dataset.upload;
  if (!kind || !t.files || !t.files.length) return;
  try {
    if (kind === 'posture') {
      const id = await savePhoto(t.files[0]);
      S.postures.push({ id, date: dateKey(new Date()) });
      save(); render(); toast('已保存体态照');
    } else if (kind === 'ex-photo') {
      const form = t.closest('form');
      const d = readDraft(form);
      for (const f of t.files) d.photoIds.push(await savePhoto(f));
      renderOverlay();
    } else if (kind === 'backup') {
      const data = JSON.parse(await t.files[0].text());
      if (!Array.isArray(data.exercises) || typeof data.log !== 'object') throw new Error('不是有效的备份文件');
      if (!confirm('导入会覆盖这台手机上现有的记录，继续？')) return;
      S = { ...freshState(), ...data };
      save(); render(); toast('已导入备份');
    }
  } catch (e) {
    toast(e.message || '操作失败');
  } finally {
    t.value = '';
  }
});

document.addEventListener('submit', (ev) => {
  const form = ev.target;
  if (form.dataset.form !== 'ex') return;
  ev.preventDefault();
  const d = readDraft(form);
  if (!d.name) { toast('请填写动作名称'); form.name.focus(); return; }
  if (d.videoUrl && !isHttpUrl(d.videoUrl)) { toast('视频链接要以 http:// 或 https:// 开头'); form.videoUrl.focus(); return; }
  const orig = ex(d.id);
  if (orig && orig.videoUrl !== d.videoUrl) d.videoAuto = false;
  if (orig) {
    orig.photoIds.filter((id) => !d.photoIds.includes(id)).forEach(deletePhoto);
    Object.assign(orig, d);
  } else {
    S.exercises.push({ ...d });
  }
  save();
  ui.overlay = { type: 'detail', id: d.id };
  renderOverlay(); render();
  toast('已保存');
});

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && ui.overlay) {
    if (ui.overlay.type === 'player') stopPlayer();
    else if (ui.overlay.type === 'edit') actions['close-edit']();
    else closeOverlay();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkReminders();
    // Re-render so a new day shows a fresh checklist.
    if (!ui.overlay) render();
    if (ui.player && !wakeLock) navigator.wakeLock?.request('screen').then((l) => (wakeLock = l)).catch(() => {});
  }
});

/* ---------- Boot ---------- */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW registration failed', e));
}
navigator.storage?.persist?.().catch(() => {});
render();
checkReminders();
setInterval(checkReminders, 20000);
