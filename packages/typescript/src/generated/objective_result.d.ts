/* Generated from JSON Schema. Do not edit. */

export interface ObjectiveResult {
  protocol_version: "0.1.0";
  result_id: string;
  run_id: string;
  profile: ProfileReference;
  evaluation_status: "passed" | "failed" | "error" | "not_run";
  raw_result: ArtifactReference;
  projection: ArtifactReference;
  attestation_ids: string[];
  warnings: string[];
}
export interface ProfileReference {
  id: string;
  version: string;
}
export interface ArtifactReference {
  artifact_id: string;
  digest: string;
}
