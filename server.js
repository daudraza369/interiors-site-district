// server.js - Wrapper for Next.js standalone server
// This ensures the server binds to 0.0.0.0 and uses the correct port

import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Set environment variables for the standalone server
process.env.PORT = process.env.PORT || '3000'
process.env.HOST = process.env.HOST || '0.0.0.0'
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

// Path to the standalone server
const serverPath = path.join(__dirname, '.next', 'standalone', 'server.js')

console.log('🚀 Starting Next.js standalone server...')
console.log(`   PORT: ${process.env.PORT}`)
console.log(`   HOST: ${process.env.HOST}`)
console.log(`   Server path: ${serverPath}`)

// Spawn the standalone server
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: process.env.PORT,
    HOST: process.env.HOST,
  },
})

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
})

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`)
    process.exit(code)
  }
})

// Handle termination signals
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully...')
  server.kill('SIGTERM')
})

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully...')
  server.kill('SIGINT')
})

