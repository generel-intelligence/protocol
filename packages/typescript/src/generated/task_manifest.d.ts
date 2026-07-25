/* Generated from JSON Schema. Do not edit. */

export interface TaskManifest {
  protocol_version: "0.1.0";
  task_id: string;
  suite_id: string;
  task_version: string;
  instruction: ArtifactReference;
  inputs: ArtifactReference[];
  required_capabilities: string[];
}
export interface ArtifactReference {
  artifact_id: string;
  digest: string;
}
