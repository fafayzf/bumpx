import { defineConfig } from '../src'

export default defineConfig({
  recursive: true,
  select: true,
  tag: false,
  commit: false
  // files: ['packages/**/package.json']
})