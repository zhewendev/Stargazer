// screenshot.mjs — take screenshots at multiple viewports
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8080';
const SCREENSHOTS_DIR = './screenshots';

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const pages = [
  { path: '/', name: 'home' },
  { path: '/graph', name: 'graph' },
];

async function main() {
  const browser = await chromium.launch();
  
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    
    for (const pg of pages) {
      const page = await context.newPage();
      const url = `${BASE_URL}${pg.path}`;
      console.log(`Capturing ${vp.name} (${vp.width}x${vp.height}) → ${url}`);
      
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Wait for graph to render if it's a graph page
      if (pg.path === '/graph') {
        await page.waitForTimeout(3000);
      }
      
      const filename = `${SCREENSHOTS_DIR}/${vp.name}-${pg.name}.png`;
      await page.screenshot({ path: filename, fullPage: false });
      console.log(`  → ${filename}`);
      
      await page.close();
    }
    
    await context.close();
  }
  
  await browser.close();
  console.log('Done!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
