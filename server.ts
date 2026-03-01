import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { readFile } from 'fs/promises'

const app = new Hono()

app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono API' })
})

// 静的ファイル配信
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
