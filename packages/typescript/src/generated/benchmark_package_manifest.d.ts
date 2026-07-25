/* Generated from JSON Schema. Do not edit. */

/**
 * This interface was referenced by `BenchmarkPackageManifest`'s JSON-Schema
 * via the `definition` "packageSemver".
 */
export type PackageSemver = string;
/**
 * This interface was referenced by `BenchmarkPackageManifest`'s JSON-Schema
 * via the `definition` "path".
 */
export type Path = string;
/**
 * This interface was referenced by `BenchmarkPackageManifest`'s JSON-Schema
 * via the `definition` "packageSha256".
 */
export type PackageSha256 = string;

export interface BenchmarkPackageManifest {
  protocol_version: "0.2.0";
  format_version: "0.1.0";
  suite: Suite;
  /**
   * @minItems 1
   */
  tasks: [Task, ...Task[]];
  environment: Environment;
  /**
   * @minItems 1
   */
  licenses: [License, ...License[]];
  /**
   * @minItems 1
   */
  files: [File, ...File[]];
}
/**
 * This interface was referenced by `BenchmarkPackageManifest`'s JSON-Schema
 * via the `definition` "suite".
 */
export interface Suite {
  id: string;
  version: PackageSemver;
  manifest_path: Path;
  manifest_digest: PackageSha256;
}
/**
 * This interface was referenced by `BenchmarkPackageManifest`'s JSON-Schema
 * via the `definition` "task".
 */
export interface Task {
  id: string;
  version: PackageSemver;
  manifest_path: Path;
  manifest_digest: PackageSha256;
}
/**
 * This interface was referenced by `BenchmarkPackageManifest`'s JSON-Schema
 * via the `definition` "environment".
 */
export interface Environment {
  image: string;
  platform: string;
}
/**
 * This interface was referenced by `BenchmarkPackageManifest`'s JSON-Schema
 * via the `definition` "license".
 */
export interface License {
  id: string;
  path: Path;
  digest: PackageSha256;
}
/**
 * This interface was referenced by `BenchmarkPackageManifest`'s JSON-Schema
 * via the `definition` "file".
 */
export interface File {
  path: Path;
  digest: PackageSha256;
  byte_size: number;
  license_id: string;
}
