import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
    const videoDir = path.resolve('tests-videos');
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

    console.log("🚀 Starting Comprehensive Platform E2E Test...");
    const browser = await chromium.launch({ headless: true });

    // We record the entire session to a video file so the user can watch the flow
    const context = await browser.newContext({
        recordVideo: {
            dir: videoDir,
            size: { width: 1280, height: 720 }
        }
    });

    const page = await context.newPage();

    const screenshot = async (name) => {
        await page.screenshot({ path: `tests-videos/${name}.png` });
        console.log(`📸 Saved screenshot: ${name}.png`);
    };

    page.on('console', msg => {
        if (msg.type() === 'error') console.log(`[BROWSER ERROR]: ${msg.text()}`);
    });

    try {
        // --- STEP 1: GOD LOGIN ---
        console.log("-> 1. Logging into God Mode...");
        await page.goto('http://127.0.0.1:5173/god', { waitUntil: 'networkidle' });
        await screenshot('01_login_page');

        await page.fill('input[type="email"]', 'issaciconnect@gmail.com');
        await page.fill('input[type="password"]', 'Jisha@99898542');
        await page.click('button:has-text("Authenticate")');

        // Wait for Network Hub to render
        await page.waitForSelector('text="Network Hub"', { timeout: 10000 });
        await page.waitForTimeout(2000);
        await screenshot('02_network_hub');

        // --- STEP 2: DOCTOR HOT-SWAP ---
        console.log("-> 2. Loading Doctor Dashboard via Control Portal...");

        // Click the actual Control Portal button inside the ClinicCard
        await page.click('button:has-text("Control Portal")');

        // Wait for Doctor Dashboard to load
        await page.waitForSelector('text="Operational Hub"', { timeout: 10000 });
        await page.waitForTimeout(2000);
        await screenshot('03_doctor_dashboard');

        // --- STEP 3: ADD PATIENT FLOW ---
        console.log("-> 3. Testing 'Add Patient' Modal...");

        // Click the Patient Records sidebar tab first to guarantee visibility
        await page.click('text="Patient Records"');
        await page.waitForTimeout(1000);

        // Now click the Add New Patient button in the PatientList component
        await page.click('button[title="Add New Patient"]');
        await page.waitForTimeout(1000);

        const testPatientName = `E2E Tester ${Math.floor(Math.random() * 1000)}`;
        await page.fill('input[placeholder="Identity Signature"]', testPatientName);
        await page.fill('input[placeholder="+91 0000 000 000"]', '+919999999999');
        await page.click('button:has-text("Initiate Identity Onboarding")');
        await page.waitForTimeout(2000);
        await screenshot('04_after_adding_patient');

        // --- STEP 4: ACCESS PATIENT RECORDS ---
        console.log("-> 4. Verifying Patient Record & EMR...");

        // Find the new patient in the list
        await page.fill('input[placeholder="Identity Search..."]', 'Tester');
        await page.waitForTimeout(1000);

        // Click the patient name in the list
        await page.click(`h4:has-text("${testPatientName}")`);
        await page.waitForTimeout(2000);
        await screenshot('05_patient_profile');

        // --- STEP 5: EMR INTERACTION ---
        console.log("-> 5. Expanding EMR Sections & Testing Fields...");

        // Expand Vitals
        await page.click('h3:has-text("Vitals")');
        await page.waitForTimeout(500);
        await page.fill('input[placeholder="120/80"]', '125/85');

        // Expand Clinical Examination
        await page.click('h3:has-text("Clinical Examination")');
        await page.waitForTimeout(500);
        await page.fill('textarea[placeholder="Patient\'s primary concern..."]', 'Patient presented with intense pain in upper right quadrant.');

        // Save Clinical Note
        console.log("-> 6. Testing Clinical Notes...");
        await page.click('button:has-text("+ Add Note")');
        await page.waitForTimeout(500);
        await page.fill('textarea[placeholder="Patient presented with..."]', 'This is an automated E2E test note confirming functionality.');
        await page.click('button:has-text("Save Note")');
        await page.waitForTimeout(1000);
        await screenshot('06_clinical_notes_saved');

        // --- STEP 6: CHECKOUT & DISPATCH ---
        console.log("-> 7. Testing Unified Checkout & Dispatch...");
        // Scroll to checkout
        await page.mouse.wheel(0, 1000);
        await page.waitForTimeout(1000);

        // Select Invisalign via pure text selector to bypass HTML tag shifts
        await page.click('text="Invisalign / Clear Aligners"');
        await page.waitForTimeout(1000);

        // Enter Cost
        await page.fill('input[placeholder="0.00"]', '150000');

        // Add custom aftercare rule
        await page.click('button:has-text("+ Add Custom Rule")');
        // Wait for the new textarea to render
        await page.waitForTimeout(500);
        const textareas = await page.$$('textarea');
        // The last textarea is the one we just added
        await textareas[textareas.length - 1].fill('Automated custom aftercare instruction added by Playwright.');

        await screenshot('07_before_dispatch');

        // Dispatch
        await page.click('button:has-text("Complete Visit & Dispatch")');
        console.log("-> ⏳ Waiting for Dispatch Network Request...");
        await page.waitForTimeout(5000); // Give time for confetti/animations and backend save
        await screenshot('08_after_dispatch');

        console.log("✅ E2E Audit Complete! Closing context to save video...");
    } catch (e) {
        console.error("❌ Test Failed:", e);
        await screenshot('99_ERROR_STATE');
    } finally {
        await context.close();
        await browser.close();
        console.log("🎬 Video saved in retain-dental-main/tests-videos");
    }
})();
