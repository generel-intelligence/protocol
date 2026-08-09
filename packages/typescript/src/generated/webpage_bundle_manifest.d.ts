/* Generated from JSON Schema. Do not edit. */

/**
 * This interface was referenced by `WebpageBundleManifest`'s JSON-Schema
 * via the `definition` "webpageBundlePath".
 */
export type WebpageBundlePath = string;

export interface WebpageBundleManifest {
  protocol_version: "0.8.0";
  profile: {
    id: "webpage-bundle";
    version: "0.1.0";
  };
  source_root: string;
  entrypoint: WebpageBundlePath;
  /**
   * @minItems 1
   * @maxItems 512
   */
  files: [File, ...File[]];
  total_byte_size: number;
}
/**
 * This interface was referenced by `WebpageBundleManifest`'s JSON-Schema
 * via the `definition` "file".
 */
export interface File {
  path: WebpageBundlePath;
  media_type: string;
  byte_size: number;
  artifact: {
    artifact_id: string;
    digest: string;
  };
}
