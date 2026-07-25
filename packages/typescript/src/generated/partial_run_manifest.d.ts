/* Generated from JSON Schema. Do not edit. */

export interface PartialRunManifest {
  protocol_version: "0.1.0";
  run_id: string;
  status: "running" | "failed" | "cancelled" | "abandoned";
  resumable: boolean;
  generated_at: string;
  chunks: EventChunk[];
  /**
   * @minItems 1
   */
  missing_ranges: [SequenceRange, ...SequenceRange[]];
  artifacts: ArtifactReference[];
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
