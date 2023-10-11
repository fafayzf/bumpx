# bumpx

[![GitHub stars](https://img.shields.io/github/stars/fafayzf/bumpx.svg?style=for-the-badge)](https://github.com/fafayzf/bumpx/stargazers)
&nbsp;
[![GitHub issues](https://img.shields.io/github/issues-raw/fafayzf/bumpx.svg?style=for-the-badge)](https://github.com/fafayzf/bumpx/issues)
&nbsp;
[![npm](https://img.shields.io/npm/v/@yzfu/bumpx?color=c7343a&label=npm&style=for-the-badge)](https://www.npmjs.com/package/@yzfu/bumpx)
[![Download](https://img.shields.io/npm/dt/%40yzfu%2Fbumpx?style=for-the-badge)](https://www.npmjs.com/package/@yzfu/bumpx?activeTab=readme)
&nbsp;
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)](/LICENSE)

## bump specified version of multiple packages

##### Feature:
- Based on **[bumpp](https://github.com/antfu/bumpp)**, new --select option
- Use **`-s(--select)`** to manually select the specified package for upgrade
- Disable **`push`** (opt-out by --no-push, etc.) by default
- **Always use the version of package.json in the root directory as the latest version number**

##### Details:
  1. By default, only the **`package.json`** version number of the project is updated. 
  2. If the files attribute is added to the configuration file **`bumpx.config.ts`**, all packages of **`files`** will be updated.
  3. If a **`workspaces`** is configured, the packages in the **`workspaces`** will be upgraded first.
  4. If **`-s (--select)`** is configured, you will be informed before step **2** or **4** whether to select some packages to upgrade.
  5. Supports **`npm`**, **`yarn`**, **`pnpm`** workspaces


###### Execution order:
  **script command > bumpx.config.ts > workspaces > root**

## Use
```sh
  npm install @yzfu/bumpx --save-dev
```

## Script command
```sh
  npx bumpx -s
```

## configuration file

Add a configuration file `bumpx.config.ts` in the project root directory, the file may not match

See other parameters [bumpp](https://github.com/antfu/bumpp#changes-in-this-fork)

```js
  import { defineConfig } from '@yzfu/bumpx'

  export default defineConfig({
    select: true,
    // other options see https://github.com/antfu/bumpp#changes-in-this-fork
  })
```