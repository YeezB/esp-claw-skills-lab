import fs from 'node:fs'
import path from 'node:path'
import type { Connect } from 'vite'
import matter from 'gray-matter'
import type { Plugin, ViteDevServer } from 'vite'
import { FEATURED_SKILLS } from '../src/config/allowlist'

interface SkillExtraFiles {
  references: string[]
  scripts: string[]
  assets: string[]
}

interface SkillEntry {
  id: string
  name: string
  description: string
  author: string
  title: string
  metadata: Record<string, unknown>
  extra_files: SkillExtraFiles
  files: string[]
  totalSize: number
  lastModified: string
  featured: boolean
}

interface JsonMatterOptions extends matter.GrayMatterOption<string, JsonMatterOptions> {}

function parseSkillMd(filePath: string): { frontmatter: Record<string, unknown>; title: string; body: string } {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const matterOptions: JsonMatterOptions = {
    engines: {
      json: {
        parse: (s: string) => JSON.parse(s),
        stringify: (o: unknown) => JSON.stringify(o),
      },
    },
    language: 'json',
  }
  const { data, content } = matter(raw, matterOptions)

  const titleMatch = content.match(/^#\s+(.+)$/m)
  const fallbackTitle = typeof data.name === 'string' ? data.name : ''
  const title = titleMatch ? titleMatch[1].trim() : fallbackTitle

  return { frontmatter: data, title, body: content }
}

function collectFiles(dir: string, base: string = ''): { relativePaths: string[]; totalSize: number } {
  const relativePaths: string[] = []
  let totalSize = 0

  if (!fs.existsSync(dir)) return { relativePaths, totalSize }

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name
    const full = path.join(dir, entry.name)
    if (entry.name === '_metadata.json') continue
    if (entry.isDirectory()) {
      const sub = collectFiles(full, rel)
      relativePaths.push(...sub.relativePaths)
      totalSize += sub.totalSize
    } else {
      relativePaths.push(rel)
      totalSize += fs.statSync(full).size
    }
  }

  return { relativePaths, totalSize }
}

function collectSubdirFiles(skillDir: string, subdir: string): string[] {
  const full = path.join(skillDir, subdir)
  if (!fs.existsSync(full)) return []
  return fs.readdirSync(full, { withFileTypes: true })
    .filter(e => e.isFile())
    .map(e => e.name)
}

function getLastModified(dir: string): string {
  let latest = 0
  const walk = (d: string) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name)
      if (entry.name === '_metadata.json') continue
      if (entry.isDirectory()) {
        walk(full)
      } else {
        const stat = fs.statSync(full)
        if (stat.mtimeMs > latest) latest = stat.mtimeMs
      }
    }
  }
  walk(dir)
  return latest ? new Date(latest).toISOString().split('T')[0] : ''
}

function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

const skillsRootResolved = (skillsDir: string) => path.resolve(skillsDir) + path.sep

function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const map: Record<string, string> = {
    '.md': 'text/markdown; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.yaml': 'text/yaml; charset=utf-8',
    '.yml': 'text/yaml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.py': 'text/plain; charset=utf-8',
    '.sh': 'text/plain; charset=utf-8',
    '.ts': 'text/typescript; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.vue': 'text/plain; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bin': 'application/octet-stream',
  }
  return map[ext] ?? 'application/octet-stream'
}

/** Dev-only: mirror production static `/raw/*` (see writeBundle → dist/raw). */
function rawSkillsMiddleware(skillsDir: string): Connect.NextHandleFunction {
  const root = skillsRootResolved(skillsDir)

  return (req, res, next) => {
    const rawUrl = req.url
    if (!rawUrl?.startsWith('/raw/')) {
      next()
      return
    }

    let pathname = rawUrl.split('?')[0]
    try {
      pathname = decodeURIComponent(pathname)
    } catch {
      res.statusCode = 400
      res.end('Bad Request')
      return
    }

    const rel = pathname.slice('/raw/'.length).replace(/^\/+/, '')
    if (!rel || rel.includes('\0')) {
      res.statusCode = 404
      res.end('Not Found')
      return
    }

    const abs = path.resolve(skillsDir, rel)
    if (!abs.startsWith(root)) {
      res.statusCode = 403
      res.end('Forbidden')
      return
    }

    let stat: fs.Stats
    try {
      stat = fs.statSync(abs)
    } catch {
      res.statusCode = 404
      res.end('Not Found')
      return
    }

    if (!stat.isFile()) {
      res.statusCode = 404
      res.end('Not Found')
      return
    }

    res.setHeader('Content-Type', contentTypeFor(abs))
    res.setHeader('Content-Length', stat.size)
    fs.createReadStream(abs).pipe(res)
  }
}

export default function skillsPlugin(): Plugin {
  const skillsDir = path.resolve(process.cwd(), 'skills')
  const generatedDir = path.resolve(process.cwd(), 'src/generated')

  return {
    name: 'vite-plugin-skills',
    enforce: 'pre',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(rawSkillsMiddleware(skillsDir))
    },
    buildStart() {
      fs.mkdirSync(generatedDir, { recursive: true })

      if (!fs.existsSync(skillsDir)) {
        fs.writeFileSync(path.join(generatedDir, 'skills-data.json'), '[]', 'utf-8')
        return
      }

      const entries = fs.readdirSync(skillsDir, { withFileTypes: true })
        .filter(e => e.isDirectory())

      const skills: SkillEntry[] = []

      for (const entry of entries) {
        const skillDir = path.join(skillsDir, entry.name)
        const skillMdPath = path.join(skillDir, 'SKILL.md')

        if (!fs.existsSync(skillMdPath)) continue

        const { frontmatter, title } = parseSkillMd(skillMdPath)
        const fm = frontmatter as Record<string, unknown>
        const meta = (fm.metadata ?? {}) as Record<string, unknown>

        const extraFiles: SkillExtraFiles = {
          references: collectSubdirFiles(skillDir, 'references'),
          scripts: collectSubdirFiles(skillDir, 'scripts'),
          assets: collectSubdirFiles(skillDir, 'assets'),
        }

        const { relativePaths, totalSize } = collectFiles(skillDir)
        const lastModified = getLastModified(skillDir)
        const isFeatured = FEATURED_SKILLS.includes(fm.name as string)

        const skillData: SkillEntry = {
          id: entry.name,
          name: (fm.name as string) || entry.name,
          description: (fm.description as string) || '',
          author: (fm.author as string) || '',
          title,
          metadata: meta,
          extra_files: extraFiles,
          files: relativePaths,
          totalSize,
          lastModified,
          featured: isFeatured,
        }

        skills.push(skillData)

        const metadataJson = {
          name: skillData.name,
          description: skillData.description,
          author: skillData.author,
          metadata: meta,
          extra_files: extraFiles,
        }
        fs.writeFileSync(
          path.join(skillDir, '_metadata.json'),
          JSON.stringify(metadataJson, null, 2),
          'utf-8',
        )
      }

      fs.writeFileSync(
        path.join(generatedDir, 'skills-data.json'),
        JSON.stringify(skills, null, 2),
        'utf-8',
      )
    },

    writeBundle(options) {
      const outDir = options.dir || path.resolve(process.cwd(), 'dist')
      const rawDest = path.join(outDir, 'raw')

      if (fs.existsSync(skillsDir)) {
        copyDir(skillsDir, rawDest)
      }
    },
  }
}
