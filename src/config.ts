import { loadConfig } from 'c12'
import { bumpConfigDefaults } from 'bumpp'
import type { DefaultOptions } from './types/bumpx-options'

export const bumpxConfigDefaults: DefaultOptions = {
  select: false,
  push: false
}

export async function loadBumpConfig(overrides?: Partial<DefaultOptions>,
  cwd = process.cwd()) {
  const { config } = await loadConfig<DefaultOptions>({
    name: 'bumpx',
    defaults: {
      ...bumpConfigDefaults,
      ...bumpxConfigDefaults
    },
    overrides: {
      ...(overrides as DefaultOptions),
    },
    cwd,
  })

  return config!
}


export function defineConfig(config: Partial<DefaultOptions>) {
  return config
}
