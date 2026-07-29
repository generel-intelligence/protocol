/* Generated from JSON Schema. Do not edit. */

/**
 * This interface was referenced by `CaptureCoverageManifest`'s JSON-Schema
 * via the `definition` "coverageRecord".
 */
export type CoverageRecord = {
  [k: string]: unknown;
} & {
  channel: Channel;
  scope: "run" | "agent" | "workspace";
  scope_id?: string;
  status: "complete" | "partial" | "unavailable";
  reason_code?: ReasonCode;
  /**
   * @minItems 1
   */
  capture_sources: [string, ...string[]];
  harness_id: string;
  harness_version: string;
  adapter_version: string;
  warnings: string[];
};
/**
 * This interface was referenced by `CaptureCoverageManifest`'s JSON-Schema
 * via the `definition` "channel".
 */
export type Channel =
  | "agent_identity"
  | "agent_parentage"
  | "agent_lifecycle"
  | "workspace_identity"
  | "conversation"
  | "returned_reasoning"
  | "model_transport"
  | "response_stream"
  | "model_agent_attribution"
  | "tool_calls"
  | "tool_results"
  | "tool_agent_attribution"
  | "terminal"
  | "filesystem_final_state"
  | "filesystem_history";
/**
 * This interface was referenced by `CaptureCoverageManifest`'s JSON-Schema
 * via the `definition` "reasonCode".
 */
export type ReasonCode =
  | "harness_surface_partial"
  | "harness_surface_unavailable"
  | "native_identifier_missing"
  | "native_parentage_missing"
  | "provider_route_bypasses_gateway"
  | "unsupported_harness_extension"
  | "workspace_outside_authorized_roots"
  | "capture_interrupted"
  | "adapter_parse_error"
  | "native_timestamp_missing";

export interface CaptureCoverageManifest {
  protocol_version: "0.6.0";
  run_id: string;
  phase: "expected" | "achieved";
  /**
   * @minItems 15
   */
  records: [
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    CoverageRecord,
    ...CoverageRecord[]
  ];
}
