/* Generated from JSON Schema. Do not edit. */

export interface OperatorAction {
  protocol_version: "0.9.0";
  run_id: string;
  action_id: string;
  actor: "human_operator";
  kind: "guidance" | "finish";
  delivery: "steer" | "new_turn";
  submitted_at: string;
  delivered_at: string;
  message: ArtifactReference;
}
export interface ArtifactReference {
  artifact_id: string;
  digest: string;
}
