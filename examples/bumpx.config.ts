import { defineConfig } from '../src'

export default defineConfig({
  recursive: true,
  select: false,
  tag: false,
  commit: false
  // files: ['packages/**/package.json']
})