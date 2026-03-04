import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { readFile } from 'fs/promises'

const app = new Hono()

app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono API' })
})

// Serve large image files with proper headers
app.get('/minecraft-city.png', async (c) => {
  try {
    const fileBuffer = await readFile('./dist/minecraft-city.png')
    c.header('Content-Type', 'image/png')
    c.header('Cache-Control', 'public, max-age=3600')
    c.header('Content-Length', fileBuffer.length.toString())
    return c.body(fileBuffer)
  } catch (error) {
    console.error('Error serving minecraft-city.png:', error)
    return c.notFound()
  }
})

// Serve snake SVGs from dist/ (updated by cron git fetch)
app.get('/github-contribution-grid-snake-dark.svg', async (c) => {
  try {
    const svg = await readFile('./dist/github-contribution-grid-snake-dark.svg', 'utf-8')
    c.header('Content-Type', 'image/svg+xml')
    c.header('Cache-Control', 'no-cache, must-revalidate')
    return c.body(svg)
  } catch {
    return c.notFound()
  }
})

app.get('/github-contribution-grid-snake.svg', async (c) => {
  try {
    const svg = await readFile('./dist/github-contribution-grid-snake.svg', 'utf-8')
    c.header('Content-Type', 'image/svg+xml')
    c.header('Cache-Control', 'no-cache, must-revalidate')
    return c.body(svg)
  } catch {
    return c.notFound()
  }
})

// Static file serving for dist directory
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
