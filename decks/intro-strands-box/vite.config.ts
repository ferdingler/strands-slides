import { defineConfig } from 'vite'

// Midway tunnel hostname, so `npm run preview` can be shared via `tunnel create`.
const tunnelHost = 'fdingler-strands-slides.w.tunnels.lab.aws.dev'

export default defineConfig({
  build: { emptyOutDir: true },
  server: { host: '127.0.0.1', allowedHosts: [tunnelHost] },
  preview: { host: '127.0.0.1', allowedHosts: [tunnelHost] },
})
