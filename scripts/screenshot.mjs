/**
 * Screenshot script — captures all pages with animations settled.
 * Run: node scripts/screenshot.mjs
 * Requires: npm install puppeteer (run once, then remove if desired)
 */
import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'

const BASE   = 'http://localhost:5175'
const OUTDIR = './screenshots'

const pages = [
  { slug: 'home',    path: '/' },
  { slug: 'track',   path: '/track' },
  { slug: 'about',   path: '/about' },
  { slug: 'contact', path: '/contact' },
  { slug: 'admin',   path: '/admin'  },
]

await mkdir(OUTDIR, { recursive: true })

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page    = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })

for (const { slug, path } of pages) {
  console.log(`📸  ${slug}…`)
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1800))   // let Framer Motion animate in
  await page.screenshot({ path: `${OUTDIR}/${slug}.png`, fullPage: false })
  console.log(`    ✓ saved ${slug}.png`)
}

await browser.close()
console.log('\nAll screenshots saved to ./screenshots/')
