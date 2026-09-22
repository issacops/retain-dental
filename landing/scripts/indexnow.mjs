#!/usr/bin/env node
// Ping IndexNow (Bing, Yandex, Seznam, Naver) with every URL in the sitemap.
// Run after each deploy:  node scripts/indexnow.mjs
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const HOST = process.env.SITE_URL || 'https://www.retaindental.com'

// The key is the name of the file we host at /<key>.txt
const keyFile = readdirSync(join(root, 'public')).find((f) => /^[a-f0-9]{32}\.txt$/.test(f))
if (!keyFile) { console.error('No IndexNow key file found in public/'); process.exit(1) }
const key = keyFile.replace('.txt', '')

const sitemap = readFileSync(join(root, 'dist', 'sitemap-0.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `${HOST}/${key}.txt`, urlList: urls }),
})

console.log(`IndexNow: submitted ${urls.length} URLs -> ${res.status} ${res.statusText}`)
