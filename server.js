// server.js - Wrapper for Next.js standalone server
// This ensures the server binds to 0.0.0.0 and uses the correct port

import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { chdir } from 'process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Set environment variables for the standalone server
process.env.PORT = process.env.PORT || '3000'
process.env.HOSTNAME = process.env.HOST || '0.0.0.0'
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

// Path to the standalone directory
const standaloneDir = path.join(__dirname, '.next', 'standalone')
const serverPath = path.join(standaloneDir, 'server.js')

console.log('🚀 Starting Next.js standalone server...')
console.log(`   PORT: ${process.env.PORT}`)
console.log(`   HOSTNAME: ${process.env.HOSTNAME}`)
console.log(`   Working directory: ${standaloneDir}`)
console.log(`   Server path: ${serverPath}`)

// Change to standalone directory (required for Next.js standalone)
chdir(standaloneDir)

// Spawn the standalone server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: standaloneDir,
  env: {
    ...process.env,
    PORT: process.env.PORT,
    HOSTNAME: process.env.HOSTNAME,
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

