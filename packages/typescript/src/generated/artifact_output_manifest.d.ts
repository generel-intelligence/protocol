/* Generated from JSON Schema. Do not edit. */

/**
 * This interface was referenced by `ArtifactOutputManifest`'s JSON-Schema
 * via the `definition` "artifactOutputPath".
 */
export type ArtifactOutputPath = string;
/**
 * This interface was referenced by `ArtifactOutputManifest`'s JSON-Schema
 * via the `definition` "mediaType".
 */
export type MediaType = string;

export interface ArtifactOutputManifest {
  protocol_version: "0.8.0";
  /**
   * @minItems 1
   * @maxItems 32
   */
  outputs?: [FileOutput, ...FileOutput[]];
  /**
   * @minItems 1
   * @maxItems 8
   */
  webpage_bundles?:
    | [WebpageBundleOutput]
    | [WebpageBundleOutput, WebpageBundleOutput]
    | [WebpageBundleOutput, WebpageBundleOutput, WebpageBundleOutput]
    | [WebpageBundleOutput, WebpageBundleOutput, WebpageBundleOutput, WebpageBundleOutput]
    | [WebpageBundleOutput, WebpageBundleOutput, WebpageBundleOutput, WebpageBundleOutput, WebpageBundleOutput]
    | [
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput
      ]
    | [
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput
      ]
    | [
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput,
        WebpageBundleOutput
      ];
}
/**
 * This interface was referenced by `ArtifactOutputManifest`'s JSON-Schema
 * via the `definition` "fileOutput".
 */
export interface FileOutput {
  path: ArtifactOutputPath;
  role: string;
  media_type: MediaType;
  maximum_bytes: number;
}
/**
 * This interface was referenced by `ArtifactOutputManifest`'s JSON-Schema
 * via the `definition` "webpageBundleOutput".
 */
export interface WebpageBundleOutput {
  path: ArtifactOutputPath;
  entrypoint: ArtifactOutputPath;
  maximum_files: number;
  maximum_bytes: number;
}
