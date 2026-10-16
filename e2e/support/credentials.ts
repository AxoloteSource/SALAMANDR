import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const envFile = resolve(process.cwd(), '.env')
if (existsSync(envFile)) process.loadEnvFile(envFile)

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name}. Define it in your local .env (see .env.example) before running the e2e suite.`)
  }
  return value
}

export const REAL = {
  email: required('E2E_EMAIL'),
  password: required('E2E_PASSWORD')
}
