/* Generated from JSON Schema. Do not edit. */

/**
 * This interface was referenced by `ProtocolCommonDefinitions`'s JSON-Schema
 * via the `definition` "protocolVersion".
 */
export type ProtocolVersion = "0.1.0";
/**
 * This interface was referenced by `ProtocolCommonDefinitions`'s JSON-Schema
 * via the `definition` "sha256".
 */
export type Sha256 = string;
/**
 * This interface was referenced by `ProtocolCommonDefinitions`'s JSON-Schema
 * via the `definition` "entityId".
 */
export type EntityId = string;
/**
 * This interface was referenced by `ProtocolCommonDefinitions`'s JSON-Schema
 * via the `definition` "runId".
 */
export type RunId = string;
/**
 * This interface was referenced by `ProtocolCommonDefinitions`'s JSON-Schema
 * via the `definition` "taskId".
 */
export type TaskId = string;
/**
 * This interface was referenced by `ProtocolCommonDefinitions`'s JSON-Schema
 * via the `definition` "artifactId".
 */
export type ArtifactId = string;
/**
 * This interface was referenced by `ProtocolCommonDefinitions`'s JSON-Schema
 * via the `definition` "timestamp".
 */
export type Timestamp = string;
/**
 * This interface was referenced by `ProtocolCommonDefinitions`'s JSON-Schema
 * via the `definition` "warning".
 */
export type Warning = string;

export interface ProtocolCommonDefinitions {
  [k: string]: unknown;
}
/**
 * This interface was referenced by `ProtocolCommonDefinitions`'s JSON-Schema
 * via the `definition` "profileReference".
 */
export interface ProfileReference {
  id: string;
  version: string;
}
/**
 * This interface was referenced by `ProtocolCommonDefinitions`'s JSON-Schema
 * via the `definition` "artifactReference".
 */
export interface ArtifactReference {
  artifact_id: ArtifactId;
  digest: Sha256;
}
/**
 * This interface was referenced by `ProtocolCommonDefinitions`'s JSON-Schema
 * via the `definition` "sequenceRange".
 */
export interface SequenceRange {
  first: number;
  last: number;
}
