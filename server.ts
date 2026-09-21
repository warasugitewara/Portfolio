import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { secureHeaders } from 'hono/secure-headers'
import { readFile } from 'node:fs/promises'
import { createGitHubReposProxy } from './githubReposProxy'

export const app = new Hono()

// Baseline security headers (CSP intentionally omitted — external avatars /
// contribution snake and the inline theme-boot script must keep working)
app.use(
  '*',
  secureHeaders({
    xFrameOptions: 'SAMEORIGIN',
    referrerPolicy: 'strict-origin-when-cross-origin',
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  }),
)

// GitHub repos proxy — validated, single-flight, bounded stale cache.
const githubReposProxy = createGitHubReposProxy()
app.get('/api/github/repos', () => githubReposProxy.get())

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

// Hashed build assets are content-addressed — cache them forever
app.use('/assets/*', async (c, next) => {
  await next()
  c.header('Cache-Control', 'public, max-age=31536000, immutable')
})

// Cache data JSON for 5 minutes
app.use('/data/*', async (c, next) => {
  await next()
  c.header('Cache-Control', 'public, max-age=300')
})

// API routes must never fall through to the SPA HTML shell.
app.all('/api/*', (c) => c.json({ error: 'not_found' }, 404))

// Static file serving for dist directory
app.use('/*', serveStatic({ root: './dist' }))

// SPA fallback
const CLIENT_ROUTES = new Set(['/', '/infrastructure'])

app.notFound(async (c) => {
  const path = c.req.path.length > 1 ? c.req.path.replace(/\/$/, '') : c.req.path
  if ((c.req.method === 'GET' || c.req.method === 'HEAD') && CLIENT_ROUTES.has(path)) {
    const html = await readFile('./dist/index.html', 'utf-8')
    return c.html(html)
  }
  return c.text('Not Found', 404)
})

export default {
  port: 3000,
  fetch: app.fetch,
}
