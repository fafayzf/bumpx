import process from 'process'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'

export const PKG_NAME = 'package.json'

// root path
export const CWD = process.cwd()
export const ROOT = findRootDir(CWD)
export const PACKAGE_JSON_FILE = join(ROOT, PKG_NAME)
export const NPM_LOCK_FILE = join(ROOT, 'package-lock.json')
export const PNPM_LOCK_FILE = join(ROOT, 'pnpm-lock.yaml')
export const YARN_LOCK_FILE = join(ROOT, 'yarn.lock')
export const PNPM_WORKSPACE_FILE = join(ROOT, 'pnpm-workspace.yaml')

// find root package.json
function findRootDir(dir: string) {
  if (existsSync(join(dir, PKG_NAME))) {
      return dir
  }
  const parentDir = dirname(dir)
  if (dir === parentDir) {
      return dir
  }
  return findRootDir(parentDir)
}

