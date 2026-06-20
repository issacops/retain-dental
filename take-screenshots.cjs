const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/usr/bin/google-chrome'
  });

  const page = await browser.newPage();

  // ===== PATIENT APP =====
  await page.setViewport({ width: 430, height: 932 });
  await page.goto('http://localhost:3000/patient', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));

  // Click through onboarding by coordinates - "MAYBE LATER" / "SKIP TOUR" / "Get Started"
  for (let i = 0; i < 6; i++) {
    try {
      // Try clicking "MAYBE LATER" at bottom center
      await page.mouse.click(215, 780);
      await new Promise(r => setTimeout(r, 1500));

      // Also try "SKIP TOUR"
      await page.mouse.click(215, 850);
      await new Promise(r => setTimeout(r, 1500));

      // Try "Get Started" button
      await page.mouse.click(215, 700);
      await new Promise(r => setTimeout(r, 1500));
    } catch(e) { break; }
  }

  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: '/home/catch/Videos/retain-dental-main/platform-screenshots/patient-home.png', fullPage: false });
  console.log('patient home done');

  // Try clicking bottom tabs
  // HOME tab - leftmost
  await page.mouse.click(54, 910);
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '/home/catch/Videos/retain-dental-main/platform-screenshots/patient-home2.png', fullPage: false });
  console.log('patient home2 done');

  // WALLET tab
  await page.mouse.click(161, 910);
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '/home/catch/Videos/retain-dental-main/platform-screenshots/patient-wallet.png', fullPage: false });
  console.log('patient wallet done');

  // CARE tab
  await page.mouse.click(269, 910);
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '/home/catch/Videos/retain-dental-main/platform-screenshots/patient-care.png', fullPage: false });
  console.log('patient care done');

  // PROFILE tab
  await page.mouse.click(376, 910);
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '/home/catch/Videos/retain-dental-main/platform-screenshots/patient-profile.png', fullPage: false });
  console.log('patient profile done');

  // ===== LOGIN SCREEN =====
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: '/home/catch/Videos/retain-dental-main/platform-screenshots/login.png', fullPage: false });
  console.log('login done');

  await browser.close();
  console.log('All screenshots done');
})();
