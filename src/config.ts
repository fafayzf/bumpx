import { loadConfig } from 'c12'
import { bumpConfigDefaults } from 'bumpp'
import { ROOT as cwd } from './contant'

import type { DefaultOptions } from './types/bumpx-options'

export const bumpxConfigDefaults: DefaultOptions = {
  select: false,
  push: false
}

export const configDefaults = {
  ...bumpConfigDefaults,
  ...bumpxConfigDefaults
}

export async function loadBumpConfig(overrides?: Partial<DefaultOptions>) {
  const { config } = await loadConfig<DefaultOptions>({
    name: 'bumpx',
    defaults: configDefaults,
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
