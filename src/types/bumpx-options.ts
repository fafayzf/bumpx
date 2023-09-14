import type { VersionBumpOptions } from "bumpp"
export interface BumpxOptions {
    /**
   * Select the specified package file, which is not enabled by default.
   *
   * @default false
   */
    select?: boolean
}

export type DefaultOptions = VersionBumpOptions & BumpxOptions