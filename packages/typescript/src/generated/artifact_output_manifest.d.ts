/* Generated from JSON Schema. Do not edit. */

/**
 * This interface was referenced by `ArtifactOutputManifest`'s JSON-Schema
 * via the `definition` "artifactOutputPath".
 */
export type ArtifactOutputPath = string;

export interface ArtifactOutputManifest {
  protocol_version: "0.7.0";
  /**
   * @minItems 1
   * @maxItems 32
   */
  outputs: [
    {
      path: ArtifactOutputPath;
      role: string;
      media_type: string;
      maximum_bytes: number;
    },
    ...{
      path: ArtifactOutputPath;
      role: string;
      media_type: string;
      maximum_bytes: number;
    }[]
  ];
}
