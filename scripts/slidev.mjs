import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const decksRoot = join(root, 'decks')
const decks = readdirSync(decksRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && existsSync(join(decksRoot, entry.name, 'slides.md')))
  .map(entry => entry.name)
  .sort()
const [command, ...args] = process.argv.slice(2)
const commands = ['dev', 'build', 'preview', 'export']

if (command === 'list') {
  console.log(decks.join('\n'))
  process.exit(0)
}

if (!commands.includes(command)) {
  console.error(`Usage: node scripts/slidev.mjs <${commands.join('|')}|list> [deck] [options]`)
  process.exit(1)
}

const deck = args[0] && !args[0].startsWith('-') ? args.shift() : 'intro-strands-box'
if (!decks.includes(deck)) {
  console.error(`Unknown deck "${deck}". Available decks: ${decks.join(', ')}`)
  process.exit(1)
}

const deckRoot = join(decksRoot, deck)
const entry = join(deckRoot, 'slides.md')
const output = join(root, 'dist', deck)
process.chdir(root)

if (command === 'preview') {
  if (args.length) {
    console.error('Preview accepts a deck name only.')
    process.exit(1)
  }
  if (!existsSync(join(output, 'index.html'))) {
    console.error(`Build this deck first: npm run build -- ${deck}`)
    process.exit(1)
  }
  const { preview } = await import('vite')
  const server = await preview({
    root: deckRoot,
    configFile: join(deckRoot, 'vite.config.ts'),
    build: { outDir: output },
    preview: { host: '127.0.0.1', port: 3032, strictPort: true },
  })
  server.printUrls()
} else {
  let cliArgs
  if (command === 'dev') {
    cliArgs = [entry, '--bind', '127.0.0.1']
  } else if (command === 'build') {
    cliArgs = ['build', entry, '--base', './', '--out', output]
  } else {
    // Node's bundled Linux C++ libraries can conflict with Chromium's system libraries.
    if (process.platform === 'linux' && process.env.LD_LIBRARY_PATH) {
      const nodeLibraries = resolve(dirname(process.execPath), '../lib/node')
      const paths = process.env.LD_LIBRARY_PATH.split(':').filter(path => path !== nodeLibraries)
      if (paths.length) process.env.LD_LIBRARY_PATH = paths.join(':')
      else delete process.env.LD_LIBRARY_PATH
    }
    mkdirSync(join(root, 'exports'), { recursive: true })
    cliArgs = ['export', entry, '--output', join(root, 'exports', `${deck}.pdf`)]
  }
  process.argv = [process.execPath, 'slidev', ...cliArgs, ...args]
  await import('@slidev/cli/dist/cli.mjs')
}
