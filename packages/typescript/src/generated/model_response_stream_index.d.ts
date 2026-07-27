/* Generated from JSON Schema. Do not edit. */

export interface ModelResponseStreamIndex {
  protocol_version: "0.5.0";
  response_artifact: ArtifactReference;
  timing_resolution_ms: number;
  segments: Segment[];
  warnings: string[];
}
export interface ArtifactReference {
  artifact_id: string;
  digest: string;
}
/**
 * This interface was referenced by `ModelResponseStreamIndex`'s JSON-Schema
 * via the `definition` "segment".
 */
export interface Segment {
  byte_offset: number;
  byte_length: number;
  captured_at: string;
}
