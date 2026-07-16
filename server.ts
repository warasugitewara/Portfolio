import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { readFile } from 'node:fs/promises'

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

// OG card image — fetched by social crawlers on every link unfurl
app.get('/og-image.png', async (c) => {
  try {
    const fileBuffer = await readFile('./dist/og-image.png')
    c.header('Content-Type', 'image/png')
    c.header('Cache-Control', 'public, max-age=86400')
    c.header('Content-Length', fileBuffer.length.toString())
    return c.body(fileBuffer)
  } catch (error) {
    console.error('Error serving og-image.png:', error)
    return c.notFound()
  }
})

// Cache data JSON for 5 minutes
app.use('/data/*', async (c, next) => {
  await next();
  c.header('Cache-Control', 'public, max-age=300');
});

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
