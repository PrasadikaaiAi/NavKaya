import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import leadHandler from './api/leads.js'

function leadApi() {
  return {
    name: 'local-lead-api',
    configureServer(server) {
      server.middlewares.use('/api/leads', (req, res) => {
        let body = ''
        let tooLarge = false
        req.on('data', (chunk) => {
          if (tooLarge) return
          body += chunk.toString()
          if (Buffer.byteLength(body) > 20000) {
            tooLarge = true
            body = ''
          }
        })
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          if (tooLarge) {
            res.statusCode = 413
            res.end(JSON.stringify({ success: false, error: 'Enquiry is too long.' }))
            return
          }
          req.body = body
          const response = {
            setHeader: (name, value) => res.setHeader(name, value),
            status(code) { res.statusCode = code; return this },
            json(data) { res.end(JSON.stringify(data)); return this },
          }
          try {
            await leadHandler(req, response)
          } catch {
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: 'Unable to send enquiry.' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), leadApi()],
  build: {
    target: ['chrome109', 'edge109', 'firefox115', 'safari16.4'],
    cssTarget: ['chrome109', 'edge109', 'firefox115', 'safari16.4'],
  },
})
