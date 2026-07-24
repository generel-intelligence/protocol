/* Generated from JSON Schema. Do not edit. */

export interface SuiteManifest {
  protocol_version: "0.1.0";
  suite_id: string;
  suite_version: string;
  license: string;
  /**
   * @minItems 1
   */
  task_ids: [string, ...string[]];
  assets: ArtifactReference[];
}
export interface ArtifactReference {
  artifact_id: string;
  digest: string;
}
