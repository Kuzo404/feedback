const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

// Бүх хуудасны tabs
const TABS = ['dashboard', 'inbox', 'sent', 'history', 'permissions'];

// Desktop & Mobile хэмжээ
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  // screenshots фолдер үүсгэх
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });

    // 1. Login хуудсын screenshot
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(1500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `login_${vp.name}.png`),
      fullPage: true,
    });
    console.log(`✅ login_${vp.name}.png`);

    // Login хийх - username, password оруулаад нэвтрэх
    try {
      // Input-д утга оруулах
      const inputs = await page.$$('input');
      if (inputs.length >= 2) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('admin');
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('123');
      }
      await delay(500);

      // Submit button дарах
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button[type="submit"]'));
        if (buttons.length > 0) buttons[0].click();
        else {
          const allBtns = Array.from(document.querySelectorAll('button'));
          const loginBtn = allBtns.find(btn => btn.textContent.includes('Нэвтрэх') || btn.textContent.includes('НЭВТРЭХ'));
          if (loginBtn) loginBtn.click();
        }
      });
      // Login нь 1.5s timeout дараа нэвтэрдэг (setTimeout 1500)
      await delay(3000);
    } catch (e) {
      console.log('Login error:', e.message);
    }

    // 2. Хуудас бүрийн screenshot
    for (const tab of TABS) {
      try {
        if (vp.name === 'mobile') {
          // Mobile: Menu icon дарж цэс нээж tab дарах
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            for (const btn of buttons) {
              if (btn.className.includes('lg:hidden') && btn.querySelector('svg')) {
                btn.click();
                return;
              }
            }
          });
          await delay(800);

          // Mobile menu дотор tab дарах
          await page.evaluate((tabId) => {
            const mapping = {
              'dashboard': 'хяналт',
              'inbox': 'хүсэлтүүд',
              'sent': 'илгээсэн',
              'history': 'түүх',
              'permissions': 'эрх',
            };
            const target = mapping[tabId] || tabId;
            const buttons = Array.from(document.querySelectorAll('button'));
            for (const btn of buttons) {
              const text = btn.textContent.trim().toLowerCase();
              if (text.includes(target)) {
                btn.click();
                return;
              }
            }
          }, tab);
          await delay(1500);
        } else {
          // Desktop: Sidebar-ийн button дарах
          await page.evaluate((tabId) => {
            const mapping = {
              'dashboard': 'хяналт',
              'inbox': 'хүсэлтүүд',
              'sent': 'илгээсэн',
              'history': 'түүх',
              'permissions': 'эрх',
            };
            const target = mapping[tabId] || tabId;
            const buttons = Array.from(document.querySelectorAll('button'));
            for (const btn of buttons) {
              const text = btn.textContent.trim().toLowerCase();
              if (text.includes(target)) {
                btn.click();
                return;
              }
            }
          }, tab);
          await delay(1500);
        }

        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, `${tab}_${vp.name}.png`),
          fullPage: true,
        });
        console.log(`✅ ${tab}_${vp.name}.png`);

        // Mobile дээр dashboard-д цэсний icon дарч нээсэн screenshot авах
        if (vp.name === 'mobile' && tab === 'dashboard') {
          try {
            await page.evaluate(() => {
              const buttons = Array.from(document.querySelectorAll('button'));
              for (const btn of buttons) {
                if (btn.className.includes('lg:hidden') && btn.querySelector('svg')) {
                  btn.click();
                  return;
                }
              }
            });
            await delay(1000);
            await page.screenshot({
              path: path.join(SCREENSHOTS_DIR, `mobile_menu_open.png`),
              fullPage: true,
            });
            console.log(`✅ mobile_menu_open.png`);

            // Backdrop дараад хаах
            await page.click('.fixed.inset-0').catch(() => {
              return page.evaluate(() => {
                const el = document.querySelector('[class*="fixed"][class*="inset-0"][class*="bg-black"]');
                if (el) el.click();
              });
            });
            await delay(500);
          } catch (e) {
            console.log('Mobile menu screenshot:', e.message);
          }
        }

      } catch (e) {
        console.log(`❌ ${tab}_${vp.name}: ${e.message}`);
      }
    }

    // Хуудасны reload (logout эффект) - дараагийн viewport-д нэвтрэхийн тулд
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(1000);
  }

  await browser.close();
  console.log('\n🎉 Бүх screenshot-ууд screenshots/ фолдерт хадгалагдлаа!');
})();
