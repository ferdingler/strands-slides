import { dirname, resolve } from 'node:path'

// A Linux Node wrapper can add its bundled C++ libraries to child processes.
// Chromium needs the system libraries, so remove only Node's library directory.
if (process.platform === 'linux' && process.env.LD_LIBRARY_PATH) {
  const nodeLibraries = resolve(dirname(process.execPath), '../lib/node')
  const paths = process.env.LD_LIBRARY_PATH.split(':').filter(path => path !== nodeLibraries)
  if (paths.length) process.env.LD_LIBRARY_PATH = paths.join(':')
  else delete process.env.LD_LIBRARY_PATH
}

process.argv = [process.execPath, 'slidev', 'export', '--output', 'strands-box.pdf', ...process.argv.slice(2)]
await import('@slidev/cli/dist/cli.mjs')
