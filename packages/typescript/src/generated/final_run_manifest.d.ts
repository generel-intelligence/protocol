/* Generated from JSON Schema. Do not edit. */

export interface FinalRunManifest {
  protocol_version: "0.1.0";
  run_id: string;
  run_outcome: "completed" | "failed" | "cancelled" | "abandoned";
  evidence_status: "complete";
  finalized_at: string;
  /**
   * @minItems 1
   */
  chunks: [EventChunk, ...EventChunk[]];
  artifacts: ArtifactReference[];
  objective_result: ArtifactReference;
}
export interface EventChunk {
  protocol_version: "0.1.0";
  run_id: string;
  ordinal: number;
  sequence_range: SequenceRange;
  event_count: number;
  digest: string;
}
export interface SequenceRange {
  first: number;
  last: number;
}
export interface ArtifactReference {
  artifact_id: string;
  digest: string;
}
