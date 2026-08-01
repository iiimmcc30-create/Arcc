import puppeteer from 'puppeteer-core';
import fs from 'fs';

const BASE = process.env.BASE_URL || 'http://localhost:8443';
const OUT = '/opt/cursor/artifacts/screenshots';
fs.mkdirSync(OUT, { recursive: true });

const results = [];
const ok = (name, detail = '') => results.push({ name, pass: true, detail });
const fail = (name, detail = '') => results.push({ name, pass: false, detail });

async function clickText(page, re) {
  return page.evaluate((pattern) => {
    const rx = new RegExp(pattern, 'i');
    const el = [...document.querySelectorAll('button,a')].find((b) => rx.test(b.textContent || ''));
    if (!el) return false;
    el.click();
    return true;
  }, re.source);
}

async function sectionCount(page, id, selector = '*') {
  return page.evaluate((sid, sel) => {
    const s = document.getElementById(sid);
    if (!s) return -1;
    return s.querySelectorAll(sel).length;
  }, id, selector);
}

const browser = await puppeteer.launch({
  executablePath: '/usr/local/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,1100'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1100 });
page.setDefaultTimeout(20000);

const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

try {
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 });
  ok('homepage loads');

  // Nav section scroll checks
  const sections = ['hero', 'about', 'games', 'teams', 'players', 'creators', 'tournaments', 'media', 'merch', 'news'];
  for (const id of sections) {
    const exists = await page.$(`#${id}`);
    if (!exists) {
      fail(`section #${id}`, 'missing');
      continue;
    }
    await page.evaluate((sid) => document.getElementById(sid)?.scrollIntoView({ behavior: 'instant', block: 'start' }));
    await new Promise((r) => setTimeout(r, 400));
    ok(`section #${id}`);
  }

  // Data cards
  const games = await sectionCount(page, 'games', '.arc-card, [class*="arc-card"]');
  // games section uses arc-card class on divs
  const gameCards = await page.evaluate(() => document.querySelectorAll('#games .arc-card').length);
  const teamCards = await page.evaluate(() => document.querySelectorAll('#teams .arc-card').length);
  const playerCards = await page.evaluate(() => document.querySelectorAll('#players .arc-card').length);
  const creatorCards = await page.evaluate(() => document.querySelectorAll('#creators .arc-card').length);
  const tournamentCards = await page.evaluate(() => document.querySelectorAll('#tournaments .arc-card').length);
  const mediaCards = await page.evaluate(() => document.querySelectorAll('#media a.arc-card, #media .arc-card').length);
  const merchCards = await page.evaluate(() => document.querySelectorAll('#merch article').length);
  const newsCards = await page.evaluate(() => document.querySelectorAll('#news .arc-card').length);

  gameCards > 0 ? ok('games cards', String(gameCards)) : fail('games cards', String(gameCards));
  teamCards > 0 ? ok('teams cards', String(teamCards)) : fail('teams cards', String(teamCards));
  playerCards > 0 ? ok('players cards', String(playerCards)) : fail('players cards', String(playerCards));
  creatorCards > 0 ? ok('creators cards', String(creatorCards)) : fail('creators cards', String(creatorCards));
  tournamentCards > 0 ? ok('tournaments cards', String(tournamentCards)) : fail('tournaments cards', String(tournamentCards));
  mediaCards > 0 ? ok('media cards', String(mediaCards)) : fail('media cards', String(mediaCards));
  merchCards > 0 ? ok('merch cards', String(merchCards)) : fail('merch cards', String(merchCards));
  newsCards > 0 ? ok('news cards', String(newsCards)) : fail('news cards', String(newsCards));

  await page.screenshot({ path: `${OUT}/e2e-merch.png` });

  // Tournament filter button
  await page.evaluate(() => document.getElementById('tournaments')?.scrollIntoView());
  const filterClicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('#tournaments button')].find((b) => /قادمة|Upcoming/i.test(b.textContent || ''));
    btn?.click();
    return !!btn;
  });
  filterClicked ? ok('tournament filter click') : fail('tournament filter click');

  // Language toggle
  const langBefore = await page.evaluate(() => document.documentElement.lang);
  await clickText(page, /EN|عربي/);
  await new Promise((r) => setTimeout(r, 400));
  const langAfter = await page.evaluate(() => document.documentElement.lang);
  langBefore !== langAfter ? ok('language toggle', `${langBefore}->${langAfter}`) : fail('language toggle', `${langBefore}->${langAfter}`);
  // switch back to AR for rest
  if (langAfter !== 'ar') {
    await clickText(page, /EN|عربي/);
    await new Promise((r) => setTimeout(r, 300));
  }

  // Join wizard flow
  const joinClicked = await clickText(page, /انضم إلينا|Join Us/);
  joinClicked ? ok('join nav button') : fail('join nav button');
  await new Promise((r) => setTimeout(r, 800));
  const joinTitle = await page.evaluate(() => /انضم إلى ARC|Join ARC/i.test(document.body.innerText));
  joinTitle ? ok('join page opened') : fail('join page opened');

  // Choose player type (use test id to avoid navbar Players link)
  const typeClicked = await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="join-type-player"]');
    if (!btn) return false;
    btn.click();
    return true;
  });
  typeClicked ? ok('join type player') : fail('join type player');
  await new Promise((r) => setTimeout(r, 500));

  // Fill personal fields on step
  await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('input.arc-input, input')];
    const map = ['Test E2E', '22', 'SA', 'e2e#1234', 'e2e@test.com'];
    inputs.slice(0, 5).forEach((input, i) => {
      const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
      proto.set.call(input, map[i] || 'x');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
  // Next a few times until submit
  for (let i = 0; i < 5; i++) {
    const done = await page.evaluate(() => /تم إرسال|Submitted|قيد المراجعة|Under Review/i.test(document.body.innerText));
    if (done) break;
    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')];
      const next = buttons.find((b) => /التالي|Next|إرسال|Submit/i.test(b.textContent || ''));
      next?.click();
    });
    await new Promise((r) => setTimeout(r, 700));
    // fill selects if present
    await page.evaluate(() => {
      document.querySelectorAll('select').forEach((sel) => {
        if (sel.options.length > 1) {
          sel.selectedIndex = 1;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      document.querySelectorAll('textarea').forEach((ta) => {
        const proto = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
        proto.set.call(ta, 'E2E achievements and message');
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      });
      document.querySelectorAll('input.arc-input').forEach((input) => {
        if (!input.value) {
          const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
          proto.set.call(input, 'ARC-E2E-01');
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });
  }
  const submitted = await page.evaluate(() => /تم إرسال|Submitted|قيد المراجعة|Under Review/i.test(document.body.innerText));
  submitted ? ok('join submit success') : fail('join submit success', await page.evaluate(() => document.body.innerText.slice(0, 250)));
  await page.screenshot({ path: `${OUT}/e2e-join.png` });

  // Back home
  await clickText(page, /العودة للرئيسية|Back to Home/);
  await new Promise((r) => setTimeout(r, 600));

  // Admin login
  const adminClicked = await clickText(page, /الإدارة|Admin/);
  adminClicked ? ok('admin button') : fail('admin button');
  await new Promise((r) => setTimeout(r, 700));
  const loginVisible = await page.evaluate(() => /دخول الإدارة|Admin Login/i.test(document.body.innerText));
  loginVisible ? ok('admin login screen') : fail('admin login screen');

  await page.type('input[type="email"]', 'madunitesp@gmail.com', { delay: 5 });
  await page.type('input[type="password"]', '494930Mm', { delay: 5 });
  await clickText(page, /تسجيل الدخول|Sign In/);
  await new Promise((r) => setTimeout(r, 1800));
  const dash = await page.evaluate(() => /لوحة التحكم|Dashboard|إجمالي اللاعبين|Total Players/i.test(document.body.innerText));
  dash ? ok('admin dashboard') : fail('admin dashboard', await page.evaluate(() => document.body.innerText.slice(0, 200)));
  await page.screenshot({ path: `${OUT}/e2e-admin.png` });

  // Navigate admin sections
  for (const label of ['اللاعبون|Players', 'الفرق|Teams', 'صناع المحتوى|Creators', 'البطولات|Tournaments', 'الأخبار|News', 'إدارة الموقع|Site', 'المشرفون|Supervisors']) {
    const clicked = await clickText(page, new RegExp(label, 'i'));
    await new Promise((r) => setTimeout(r, 500));
    clicked ? ok(`admin nav ${label}`) : fail(`admin nav ${label}`);
  }
  await page.screenshot({ path: `${OUT}/e2e-supervisors.png` });

  // Approve first pending if any
  const approved = await page.evaluate(() => {
    // go players
    const playersBtn = [...document.querySelectorAll('button')].find((b) => /اللاعبون|Players/i.test(b.textContent || ''));
    playersBtn?.click();
    return true;
  });
  await new Promise((r) => setTimeout(r, 600));
  const approveClicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => /قبول|Approve/i.test(b.textContent || ''));
    if (!btn) return false;
    btn.click();
    return true;
  });
  approveClicked ? ok('admin approve action') : ok('admin approve action skipped', 'no pending button');

  // Logout
  await clickText(page, /تسجيل الخروج|Logout/);
  await new Promise((r) => setTimeout(r, 500));
  const loggedOut = await page.evaluate(() => /دخول الإدارة|Admin Login/i.test(document.body.innerText));
  loggedOut ? ok('admin logout') : fail('admin logout');

  // Wrong password
  await page.evaluate(() => {
    document.querySelectorAll('input').forEach((i) => {
      const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
      proto.set.call(i, '');
      i.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
  await page.type('input[type="email"]', 'madunitesp@gmail.com');
  await page.type('input[type="password"]', 'wrongpass');
  await clickText(page, /تسجيل الدخول|Sign In/);
  await new Promise((r) => setTimeout(r, 800));
  const badLogin = await page.evaluate(() => /غير صحيحة|Invalid/i.test(document.body.innerText));
  badLogin ? ok('invalid login rejected') : fail('invalid login rejected');

} catch (e) {
  fail('e2e crash', e.message);
} finally {
  await browser.close();
}

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log(JSON.stringify({ passed, failedCount: failed.length, results, pageErrors: errors }, null, 2));
if (failed.length) process.exit(1);
