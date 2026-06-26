// comprehensive-screenshots.mjs — take comprehensive screenshots
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8080';
const SCREENSHOTS_DIR = './screenshots';

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const pages = [
  { path: '/', name: 'home', desc: 'Home page' },
  { path: '/graph', name: 'graph', desc: 'Standalone Graph page' },
  { path: '/Knowledge/Android', name: 'hub-android', desc: 'Android Hub page' },
  { path: '/knowledge/android/启动流程', name: 'article', desc: 'Article page' },
];

async function main() {
  const browser = await chromium.launch();
  
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    
    for (const pg of pages) {
      const page = await context.newPage();
      const url = `${BASE_URL}${pg.path}`;
      console.log(`Capturing ${vp.name} → ${pg.desc} (${pg.path})`);
      
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        // Wait for graph rendering
        if (pg.path === '/graph') {
          await page.waitForTimeout(5000);
        } else {
          await page.waitForTimeout(2000);
        }
        
        const filename = `${SCREENSHOTS_DIR}/${vp.name}-${pg.name}.png`;
        await page.screenshot({ path: filename, fullPage: false });
        console.log(`  → ${filename}`);
      } catch (err) {
        console.log(`  ERROR: ${err.message}`);
      }
      
      await page.close();
    }
    
    await context.close();
  }
  
  await browser.close();
  console.log('\nDone!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
