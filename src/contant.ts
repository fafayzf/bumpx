import process from 'process'
import { existsSync } from 'fs'
import { join, dirname } from 'path'

function findRootDir(dir: string) {
  if (existsSync(join(dir, 'package.json'))) {
      return dir
  }
  const parentDir = dirname(dir)
  if (dir === parentDir) {
      return dir
  }
  return findRootDir(parentDir)
}

export const PKG_NAME = 'package.json'

// root path
export const CWD = process.cwd()
export const ROOT = findRootDir(CWD)
export const LIB_CONFIG_FILE = join(ROOT, 'bumpx.config.ts')
export const PACKAGE_JSON_FILE = join(ROOT, PKG_NAME)
export const NPM_LOCK_FILE = join(ROOT, 'package-lock.json')
export const PNPM_LOCK_FILE = join(ROOT, 'pnpm-lock.yaml')
export const YARN_LOCK_FILE = join(ROOT, 'yarn.lock')
export const PNPM_WORKSPACE_FILE = join(ROOT, 'pnpm-workspace.yaml')
export const TS_JSON_FILE = join(ROOT, 'tsconfig.json')