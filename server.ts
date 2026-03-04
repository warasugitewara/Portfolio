import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { readFile } from 'fs/promises'

const app = new Hono()

app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono API' })
})

// Serve snake SVGs from public/ (updated by cron git fetch)
app.get('/github-contribution-grid-snake-dark.svg', async (c) => {
  try {
    const svg = await readFile('./public/github-contribution-grid-snake-dark.svg', 'utf-8')
    c.header('Content-Type', 'image/svg+xml')
    c.header('Cache-Control', 'no-cache, must-revalidate')
    return c.body(svg)
  } catch {
    return c.notFound()
  }
})

app.get('/github-contribution-grid-snake.svg', async (c) => {
  try {
    const svg = await readFile('./public/github-contribution-grid-snake.svg', 'utf-8')
    c.header('Content-Type', 'image/svg+xml')
    c.header('Cache-Control', 'no-cache, must-revalidate')
    return c.body(svg)
  } catch {
    return c.notFound()
  }
})

// 静的ファイル配
app.use('/*', serveStatic({ root: './dist' }))

// SPA fallback
app.notFound(async (c) => {
  const html = await readFile('./dist/index.html', 'utf-8')
  return c.html(html)
})

export default {
  port: 3000,
  fetch: app.fetch,
}
