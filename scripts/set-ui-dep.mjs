#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const mode = process.argv[2]
const target = mode === 'local' ? 'link:../ui' : 'github:AxoloteSource/ui#main'

const packageJsonPath = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'package.json')
let content = readFileSync(packageJsonPath, 'utf8')

const dependencyPattern = /("@axolotesource\/ui":\s*")([^"]*)(")/

if (!dependencyPattern.test(content)) {
  console.error('No se encontró la dependencia @axolotesource/ui en package.json')
  process.exit(1)
}

content = content.replace(dependencyPattern, `$1${target}$3`)
writeFileSync(packageJsonPath, content)

console.log(`@axolotesource/ui -> ${target}`)
