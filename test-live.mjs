import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Error') || text.includes('error') || text.includes('BackendFactory'))
      console.log(`[LOG]: ${text}`);
  });
  page.on('pageerror', error => console.error(`[PAGE_ERROR]: ${error.message}`));

  const screenshot = async (name) => {
    const path = `screenshots/${name}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`📸 ${name}`);
  };

  try {
    // Create screenshots dir
    const fs = await import('fs');
    fs.mkdirSync('screenshots', { recursive: true });

    // ===== STEP 1: God Mode Login =====
    console.log("\n=== STEP 1: God Mode Login ===");
    await page.goto('https://retaindental.com/god', { waitUntil: 'networkidle', timeout: 30000 });
    await screenshot('01_god_login_page');

    await page.waitForSelector('input[type="email"], input[placeholder*="Identity"]', { timeout: 10000 });
    const emailInput = await page.$('input[type="email"]') || await page.$('input[placeholder*="Identity"]');
    await emailInput.fill('issaciconnect@gmail.com');

    const passInput = await page.$('input[type="password"]') || await page.$('input[placeholder*="Passkey"]');
    await passInput.fill('Jisha@99898542');

    const loginBtn = await page.$('button:has-text("Authenticate")') || await page.$('button:has-text("Login")');
    if (loginBtn) await loginBtn.click();
    else { console.log("❌ Login button not found"); return; }

    await page.waitForTimeout(5000);
    await screenshot('02_after_login');

    // Check if we landed on the platform
    const pageContent = await page.textContent('body');
    if (pageContent.includes('Network Hub')) {
      console.log("✅ God Mode Login SUCCESS - 'Network Hub' visible");
    } else {
      console.log("⚠️ God Mode Login - 'Network Hub' NOT found, checking page...");
      console.log("  Current URL:", page.url());
    }

    // ===== STEP 2: Navigate to Doctor Dashboard =====
    console.log("\n=== STEP 2: Navigate to Doctor Dashboard ===");
    await page.goto('https://retaindental.com/doctor', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await screenshot('03_doctor_page');

    const bodyText = await page.textContent('body');

    // Handle tenant selector if present
    if (bodyText.includes('Clinic Workspace')) {
      console.log("📋 Tenant Selector detected. Clicking 'Clinic Workspace'...");
      await page.click('text="Clinic Workspace"');
      await page.waitForTimeout(5000);
      await screenshot('04_after_clinic_workspace_click');

      const newBodyText = await page.textContent('body');
      console.log("  Current URL:", page.url());

      if (newBodyText.includes('Operational Hub') || newBodyText.includes('Patient Records')) {
        console.log("✅ Doctor Dashboard loaded successfully!");
      } else if (newBodyText.includes('Authenticate') || newBodyText.includes('Login')) {
        console.log("⚠️ Redirected to login page");
      } else {
        console.log("⚠️ Unknown state after clicking Clinic Workspace");
        console.log("  Visible text excerpt:", newBodyText.substring(0, 200));
      }
    } else if (bodyText.includes('Operational Hub')) {
      console.log("✅ Doctor Dashboard loaded directly!");
    } else if (bodyText.includes('Authenticate') || bodyText.includes('Login')) {
      console.log("⚠️ Redirected to Login page from /doctor");

      // Try logging in as clinic admin
      const emailInput2 = await page.$('input[type="email"]') || await page.$('input[placeholder*="Identity"]');
      if (emailInput2) {
        await emailInput2.fill('issaciconnect@gmail.com');
        const passInput2 = await page.$('input[type="password"]') || await page.$('input[placeholder*="Passkey"]');
        await passInput2.fill('Jisha@99898542');
        const loginBtn2 = await page.$('button:has-text("Authenticate")') || await page.$('button:has-text("Login")');
        if (loginBtn2) await loginBtn2.click();
        await page.waitForTimeout(5000);
        await screenshot('05_after_clinic_login');

        const afterLoginText = await page.textContent('body');
        console.log("  Current URL:", page.url());
        if (afterLoginText.includes('Clinic Workspace')) {
          console.log("📋 Tenant Selector appeared after login. Clicking 'Clinic Workspace'...");
          await page.click('text="Clinic Workspace"');
          await page.waitForTimeout(5000);
          await screenshot('06_after_workspace_select');
        }
      }
    } else {
      console.log("⚠️ Unexpected page state");
      console.log("  Visible text excerpt:", bodyText.substring(0, 300));
    }

    // ===== STEP 3: Final State Check =====  
    console.log("\n=== STEP 3: Final State ===");
    await screenshot('07_final_state');
    const finalText = await page.textContent('body');
    console.log("  Current URL:", page.url());

    const checks = [
      'Operational Hub',
      'Patient Records',
      'Appointment',
      'Morning Brief'
    ];

    for (const check of checks) {
      if (finalText.includes(check)) {
        console.log(`  ✅ Found: "${check}"`);
      } else {
        console.log(`  ❌ Missing: "${check}"`);
      }
    }

    // ===== STEP 4: Test RLS by checking Supabase data fetch =====
    console.log("\n=== STEP 4: Supabase Data Integrity Check ===");
    const errors = [];
    page.on('console', msg => {
      if (msg.text().includes('RLS') || msg.text().includes('permission denied') || msg.text().includes('policy')) {
        errors.push(msg.text());
      }
    });

    // Reload to trigger fresh data fetch
    await page.reload({ waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);
    await screenshot('08_after_reload');

    if (errors.length > 0) {
      console.log("⚠️ RLS-related errors detected:");
      errors.forEach(e => console.log(`  - ${e}`));
    } else {
      console.log("✅ No RLS policy errors detected during data fetch");
    }

    console.log("\n=== TEST COMPLETE ===");

  } catch (err) {
    console.error("❌ Test failed:", err.message);
    try { await screenshot('99_error_state'); } catch (e) { }
  } finally {
    await browser.close();
  }
})();
