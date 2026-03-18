import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { exec } from 'child_process'

export default defineConfig({
  base: '/dashboard/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'open-folder',
      configureServer(server) {
        server.middlewares.use('/api/open-folder', (req, res) => {
          const url = new URL(req.url, 'http://localhost')
          const folderPath = url.searchParams.get('path')
          if (!folderPath) {
            res.writeHead(400); res.end('Missing path'); return
          }
          res.writeHead(200); res.end('OK')
          exec(`explorer "${folderPath}"`)
        })
      },
    },
  ],
})
