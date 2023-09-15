import c from 'picocolors'

/**
 * CLI exit codes.
 *
 * @see https://nodejs.org/api/process.html#process_exit_codes
 */
export enum ExitCode {
  Success = 0,
  FatalError = 1,
  InvalidArgument = 9,
}

export function errorHandler(error: Error): never {
  console.error(c.red(error.message))
  return process.exit(ExitCode.InvalidArgument)
}

export function warnHandler(message: string) {
  console.warn(c.yellow(message))
  return process.exit(ExitCode.Success)
}