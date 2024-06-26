import cac from 'cac'
import c from 'picocolors'
import { versionBump } from 'bumpp'
import { valid as isValidVersion } from 'semver'
import { version } from '../package.json'
import { ExitCode, errorHandler } from './exit-code'
import { loadBumpConfig, configDefaults } from './config'
import { isReleaseType } from './release-type'
import { filterPkgFiles, selectFiles } from './select-pkg'

import type { DefaultOptions } from './types/bumpx-options'

export interface ParsedArgs {
  help?: boolean
  version?: boolean
  quiet?: boolean
  options: DefaultOptions
}

export async function parseArgs() {
  try {
    const cli = cac('bumpx')

    cli
      .version(version)
      .usage('[...files]')
      .option('--preid <preid>', 'ID for prerelease')
      .option('--all', `Include all files (default: ${configDefaults.all})`)
      .option('-c, --commit [msg]', `Commit message (default: ${configDefaults.commit})`)
      .option('-t, --tag [tag]', `Tag name (default: ${configDefaults.tag})`)
      .option('-p, --push', `Push to remote (default: ${configDefaults.push})`)
      .option('-y, --yes', `Skip confirmation (default: ${!configDefaults.confirm})`)
      .option('-r, --recursive', `Bump package.json files recursively (default: ${configDefaults.recursive})`)
      .option('--no-verify', 'Skip git verification')
      .option('--ignore-scripts', `Ignore scripts (default: ${configDefaults.ignoreScripts})`)
      .option('-q, --quiet', 'Quiet mode')
      .option('-v, --version <version>', 'Tagert version')
      .option('-x, --execute <command>', 'Commands to execute after version bumps')
      .option('-s, --select', `Select the specified package file (default: ${configDefaults.select})`)
      .help()
    
    const result = cli.parse()
    const args = result.options
    const parsedArgs: ParsedArgs = {
      help: args.help as boolean,
      version: args.version as boolean,
      quiet: args.quiet as boolean,
      options: await loadBumpConfig({
        select: args.select,
        preid: args.preid,
        commit: args.commit,
        tag: args.tag,
        push: args.push,
        all: args.all,
        confirm: !args.yes,
        noVerify: !args.verify,
        files: [...(args['--'] || []), ...result.args],
        ignoreScripts: args.ignoreScripts,
        execute: args.execute,
        recursive: !!args.recursive,
      })
    }

    if (parsedArgs.options.files && parsedArgs.options.files.length > 0) {
      const firstArg = parsedArgs.options.files[0]

      if (firstArg === 'prompt' || isReleaseType(firstArg) || isValidVersion(firstArg)) {
        parsedArgs.options.release = firstArg
        parsedArgs.options.files.shift()
      }
    }

    if (parsedArgs.options.recursive) {
      if (parsedArgs.options.files?.length)
        console.log(c.yellow('The --recursive option is ignored when files are specified'))

      else
        parsedArgs.options.files = []
    }
    
    return parsedArgs
    
  } catch (error) {
    return errorHandler(error)
  }
}




export async function main() {
  try {
    process.on('uncaughtException', errorHandler)
    process.on('unhandledRejection', errorHandler)

    const { help, version, options } = await parseArgs()

    if (help) {
      process.exit(ExitCode.Success)
    }
    else if (version) {
      // Show the version number and exit
      process.exit(ExitCode.Success)
    }
    else {
      options.files = await filterPkgFiles(options)

      if (options.select) {
        options.recursive = false
        options.files = await selectFiles(options.files)
      }
      
      await versionBump(options)
    }

  } catch (error) {
    errorHandler(error)
  }
}