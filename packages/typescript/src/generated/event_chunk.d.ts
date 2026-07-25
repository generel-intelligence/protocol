/* Generated from JSON Schema. Do not edit. */

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
