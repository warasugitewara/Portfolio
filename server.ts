import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { secureHeaders } from 'hono/secure-headers'
import { readFile } from 'node:fs/promises'

const app = new Hono()

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

// GitHub repos proxy — server-side fetch with a 5min in-memory cache so the
// public GitHub API is hit at most once per interval (avoids 60 req/h/IP rate
// limiting) and returns stale data on upstream failure instead of an empty list.
const GH_REPOS_URL =
  'https://api.github.com/users/warasugitewara/repos?sort=updated&per_page=12&type=owner'
const REPOS_TTL_MS = 5 * 60 * 1000
let reposCache: { at: number; body: string } | null = null

app.get('/api/github/repos', async () => {
  const now = Date.now()
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300',
  }
  if (reposCache && now - reposCache.at < REPOS_TTL_MS) {
    return new Response(reposCache.body, { status: 200, headers: { ...headers, 'X-Cache': 'HIT' } })
  }
  try {
    const upstream = await fetch(GH_REPOS_URL, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'warasugi-portfolio' },
    })
    const body = await upstream.text()
    if (upstream.ok) {
      reposCache = { at: now, body }
      return new Response(body, { status: 200, headers: { ...headers, 'X-Cache': 'MISS' } })
    }
    // Upstream error (e.g. rate limited): fall back to stale cache if present
    if (reposCache) {
      return new Response(reposCache.body, { status: 200, headers: { ...headers, 'X-Cache': 'STALE' } })
    }
    return new Response(body, { status: upstream.status, headers })
  } catch (error) {
    console.error('GitHub proxy error:', error)
    if (reposCache) {
      return new Response(reposCache.body, { status: 200, headers: { ...headers, 'X-Cache': 'STALE' } })
    }
    return new Response(JSON.stringify({ error: 'github_unavailable' }), { status: 502, headers })
  }
})

// Hero background — resized WebP (was a 5.9MB PNG). Long-lived immutable cache.
app.get('/minecraft-city.webp', async (c) => {
  try {
    const fileBuffer = await readFile('./dist/minecraft-city.webp')
    c.header('Content-Type', 'image/webp')
    c.header('Cache-Control', 'public, max-age=2592000, immutable')
    c.header('Content-Length', fileBuffer.length.toString())
    return c.body(fileBuffer)
  } catch (error) {
    console.error('Error serving minecraft-city.webp:', error)
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
