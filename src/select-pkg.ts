import { existsSync } from 'node:fs'
import glob from 'fast-glob'
import prompts from 'prompts'
import { join } from 'node:path'
import { readTextFile, readJsonFile } from './fs'
import { isManifest } from './mainfest'
import { errorHandler } from './exit-code'

import type { DefaultOptions } from './types/bumpx-options'

import {
  ROOT,
  PKG_NAME,
  NPM_LOCK_FILE,
  PNPM_LOCK_FILE,
  YARN_LOCK_FILE,
  PACKAGE_JSON_FILE,
  PNPM_WORKSPACE_FILE,
} from './contant'


export async function filterPkgFiles(options: DefaultOptions): Promise<string[]> {
  let pkgFiles: string[] = [], files: string[] = []
  // If files are not configured, priority will be given to package.json in the workspace.
  if (options.files?.length) {
    files = options.files as string[]
    pkgFiles = finePkgFile(files)
  }
  else {
    files = [PKG_NAME]
    const workFiles = await findWorkspace(files) as string[]
    pkgFiles = finePkgFile(workFiles)
  }
  
  return pkgFiles
  
}

export async function findWorkspace(files: string[]) {
  try {
    // package-lock.json, yarn.lock
    if (existsSync(NPM_LOCK_FILE) || existsSync(YARN_LOCK_FILE)) {
      const { data: manifest } = await readJsonFile(PACKAGE_JSON_FILE)

      if (isManifest(manifest) && manifest.workspaces) {
        for (let path of (manifest.workspaces as string[])) {
          
          const filepath = convertPath(join(path, PKG_NAME))
          files.push(filepath)
        }
      }
    }
    // pnpm-lock.yaml
    else if (existsSync(PNPM_LOCK_FILE)) {
      const { data } = await readTextFile(PNPM_WORKSPACE_FILE)
      const regex = /'([^']+)'/g
      let match

      while ((match = regex.exec(data))) {
        const filepath = convertPath(join(match[1], PKG_NAME))
        files.push(filepath)
      }
    }
  } catch(e) {
    return files
  }

  return files
}

function finePkgFile(files: string[]) {
  const result = glob.sync(files, {
    cwd: ROOT,
    ignore: [
      '**/{.git,node_modules,bower_components,__tests__,fixtures,fixture}/**',
    ],
  })
  return result
}

function convertPath(windowsPath: string) {
  return windowsPath.replace(/^\\\\\?\\/,"").replace(/\\/g,'\/').replace(/\/\/+/g,'\/')
}

export async function selectFiles(files: string[]) {
  const filepaths = []

  files = files.filter(file => file !== PKG_NAME)

  for (let file of files) {
    const filepath = join(ROOT, file)
    const { data: manifest } = await readJsonFile(filepath)
    if (isManifest(manifest)) {
      filepaths.push({
        title: `${manifest.name} - ${manifest.version}`,
        value: file
      })
    }
  }

  const { isall } = await prompts([
    {
      type: 'confirm',
      name: 'isall',
      message: 'Publish all?',
      initial: false, // Default manual selection
    }
  ])

  if (isall === undefined) {
    errorHandler({
      name: 'Publish all',
      message: 'No choice, exit abnormally'
    })
  }

  if (!isall) {
    const { upgrade } = await prompts([
      {
        type: 'autocompleteMultiselect',
        name: 'upgrade',
        message: 'Select the package that needs to be upgraded',
        choices: filepaths,
        hint: '- Space to select. Return to keyboard `Enter`'
      }
    ])

    if (upgrade === undefined) {
      errorHandler({
        name: 'upgrade',
        message: 'No choice, exit abnormally'
      })
    }

    files = upgrade
  }
  
  // Upgrade based on the `package.json` version number in the root directory
  files.unshift(PKG_NAME)
  
  return files
}