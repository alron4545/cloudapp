import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Mirrors the /download/photos/ location in nginx.conf so the Download
// button also works under `npm run dev` and `npm run preview`.
function photoDownloads() {
  function middleware(photosDir) {
    return (req, res, next) => {
      const rel = decodeURIComponent(req.url.split('?')[0])
      const file = path.join(photosDir, rel)
      if (!file.startsWith(photosDir + path.sep) || !fs.existsSync(file)) return next()
      res.setHeader('Content-Type', 'image/jpeg')
      res.setHeader('Content-Disposition', 'attachment')
      res.setHeader('Cache-Control', 'no-store')
      fs.createReadStream(file).pipe(res)
    }
  }

  return {
    name: 'photo-downloads',
    configureServer(server) {
      server.middlewares.use('/download/photos', middleware(path.join(server.config.publicDir, 'photos')))
    },
    configurePreviewServer(server) {
      server.middlewares.use('/download/photos', middleware(path.resolve(server.config.build.outDir, 'photos')))
    },
  }
}

export default defineConfig({
  plugins: [react(), photoDownloads()],
  server: { host: true, port: 5173 },
})
